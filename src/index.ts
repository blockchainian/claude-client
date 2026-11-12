import type { Authentication } from './auth.js';
import { createAuthentication } from './auth.js';
import type { ClientBatches } from './batches.js';
import { createBatches } from './batches.js';

export type {
  BatchRequest,
  BatchCreateParams,
  BatchResultsOptions,
  BatchResult,
  ClientBatches,
} from './batches.js';

export type { Authentication } from './auth.js';
import type {
  ContentBlockParam,
  Message,
  MessageCreateParamsNonStreaming,
  Model,
  OutputConfig,
} from '@anthropic-ai/sdk/resources/messages';

/** A JSON schema for structured output. */
export interface JsonSchema {
  [keyword: string]: unknown;
}

/** One model call. */
export interface RespondRequest {
  model: Model;
  effort: NonNullable<OutputConfig['effort']>;
  /** The system prompt, cached so later calls with the same prefix read it. */
  instructions: string;
  input: string | ContentBlockParam[];
  /** A JSON schema; the output is then the parsed JSON reply. */
  schema?: JsonSchema;
  /** The output token limit; defaults to 16000. */
  maxTokens?: number;
  /** Prompt-cache lifetime; defaults to five minutes. */
  cacheTtl?: '5m' | '1h';
}

/** A model call whose output follows a JSON schema. */
export interface StructuredRequest extends RespondRequest {
  schema: JsonSchema;
}

/** Token counts of one call; `inputTokens` excludes cached tokens. */
export interface Usage {
  inputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  outputTokens: number;
  /** The share of `outputTokens` spent on reasoning. */
  reasoningOutputTokens: number;
}

/** The output and token usage of a model call. */
export interface RespondResult<T> {
  output: T;
  usage: Usage;
}

/** Options of `createClaudeClient`. */
export interface ClientOptions {
  /** The maximum number of calls in progress; defaults to 20. */
  concurrency?: number;
  /** Defaults to `ANTHROPIC_API_KEY`. */
  apiKey?: string;
  /** Selects the existing Claude Code account login or API key billing. */
  auth?: Authentication;
  /** Retries of rate-limited and failed requests; defaults to 4. */
  maxRetries?: number;
}

/** A Claude Messages client. */
export interface ClaudeClient {
  /** Native batch operations, available with API key authentication. */
  batches: ClientBatches;
  /** Queues a model call and resolves with its parsed JSON output. */
  respond(request: StructuredRequest): Promise<RespondResult<unknown>>;
  /** Queues a model call and resolves with its text output. */
  respond(request: RespondRequest): Promise<RespondResult<string>>;
  /** Waits for accepted calls and refuses further calls. */
  close(): Promise<void>;
}

type Task<T> = () => Promise<T>;

function createLimiter(concurrency: number) {
  const waiting: Array<() => void> = [];
  let active = 0;
  async function limit<T>(task: Task<T>): Promise<T> {
    if (active < concurrency) {
      active++;
    } else {
      // A finishing task hands its slot over without releasing it.
      await new Promise<void>((resolve) => {
        waiting.push(resolve);
      });
    }
    try {
      return await task();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active--;
    }
  }
  return limit;
}

// Runs the first task of each prompt prefix alone, so it writes the prompt
// cache before the tasks that share the prefix read it.
function createScheduler(concurrency: number) {
  const limit = createLimiter(concurrency);
  const cacheWrites = new Map<string, Promise<unknown>>();
  const pending = new Set<Promise<unknown>>();

  async function run<T>(prefix: string, task: Task<T>): Promise<T> {
    const cacheWrite = cacheWrites.get(prefix);
    if (cacheWrite) await cacheWrite;
    const call = limit(task);
    if (!cacheWrite)
      cacheWrites.set(
        prefix,
        call.catch(() => undefined),
      );
    return call;
  }

  function schedule<T>(prefix: string, task: Task<T>): Promise<T> {
    const call = run(prefix, task);
    const settled: Promise<boolean> = call.then(
      () => pending.delete(settled),
      () => pending.delete(settled),
    );
    pending.add(settled);
    return call;
  }

  async function drain(): Promise<void> {
    await Promise.all(pending);
  }

  return { schedule, drain };
}

function usageOf({ usage }: Message): Usage {
  return {
    inputTokens: usage.input_tokens,
    cacheCreationInputTokens: usage.cache_creation_input_tokens ?? 0,
    cacheReadInputTokens: usage.cache_read_input_tokens ?? 0,
    outputTokens: usage.output_tokens,
    reasoningOutputTokens: usage.output_tokens_details?.thinking_tokens ?? 0,
  };
}

function messageParams(
  authentication: ReturnType<typeof createAuthentication>,
  request: RespondRequest,
): MessageCreateParamsNonStreaming {
  const { model, effort, instructions, input, schema } = request;
  /* eslint-disable @typescript-eslint/naming-convention -- The Messages API uses snake_case fields. */
  return {
    model,
    max_tokens: request.maxTokens ?? 16_000,
    output_config: {
      effort,
      format: schema && { type: 'json_schema', schema },
    },
    system: authentication.system(instructions, request.cacheTtl),
    messages: [{ role: 'user', content: input }],
  };
  /* eslint-enable @typescript-eslint/naming-convention -- The snake_case Messages API fields end here. */
}

function parseMessage(
  message: Message,
  request: RespondRequest,
): RespondResult<unknown> {
  if (message.stop_reason !== 'end_turn') {
    throw new Error(`Unexpected stop reason: ${message.stop_reason}.`);
  }
  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
  const output: unknown = request.schema ? JSON.parse(text) : text;
  return { output, usage: usageOf(message) };
}

async function send(
  authentication: ReturnType<typeof createAuthentication>,
  request: RespondRequest,
) {
  const message = await authentication
    .client()
    .messages.create(
      messageParams(authentication, request),
      authentication.requestOptions,
    );
  return parseMessage(message, request);
}

function authenticatedBatches(
  authentication: ReturnType<typeof createAuthentication>,
  assertOpen: () => void,
) {
  return createBatches({
    client: () => authentication.client(),
    assertAllowed() {
      assertOpen();
      assertBatchAuthentication(authentication.account);
    },
    params: (request) => messageParams(authentication, request),
    parse: parseMessage,
  });
}

function assertBatchAuthentication(account: boolean): void {
  if (account)
    throw new Error(
      'Native batches require API key authentication; account authentication is not supported.',
    );
}

/**
 * Creates a Claude Messages client that runs at most `concurrency` calls at
 * once. The first call with given model, effort, instructions and schema runs
 * alone, so the calls that share its prompt prefix read it from the cache.
 */
export function createClaudeClient({
  concurrency = 20,
  apiKey,
  auth,
  maxRetries = 4,
}: ClientOptions = {}): ClaudeClient {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
    throw new Error('Invalid concurrency.');
  }
  const authentication = createAuthentication({ apiKey, auth, maxRetries });
  const scheduler = createScheduler(concurrency);
  let closed = false;

  function assertOpen() {
    if (closed) throw new Error('Claude client is closed.');
  }

  function respond(request: StructuredRequest): Promise<RespondResult<unknown>>;
  function respond(request: RespondRequest): Promise<RespondResult<string>>;
  async function respond(request: RespondRequest) {
    assertOpen();
    const { model, effort, instructions, schema } = request;
    const prefix = JSON.stringify([
      model,
      effort,
      instructions,
      schema,
      request.cacheTtl,
    ]);
    return scheduler.schedule(prefix, async () => send(authentication, request));
  }

  const batchOperations = authenticatedBatches(authentication, assertOpen);

  async function close(): Promise<void> {
    closed = true;
    await Promise.all([scheduler.drain(), batchOperations.drain()]);
  }

  return { respond, close, batches: batchOperations.batches };
}
