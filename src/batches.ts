import type Anthropic from '@anthropic-ai/sdk';
import type {
  Message,
  MessageCreateParamsNonStreaming,
} from '@anthropic-ai/sdk/resources/messages';
import type { MessageBatch } from '@anthropic-ai/sdk/resources/messages/batches';

import type { RespondRequest, RespondResult } from './index.js';

/* eslint-disable @typescript-eslint/naming-convention -- Batch custom_id follows both providers' APIs. */
/** One named model request in a batch. */
export interface BatchRequest {
  custom_id: string;
  params: RespondRequest;
}

/** Parameters for creating a native Messages batch. */
export interface BatchCreateParams {
  requests: BatchRequest[];
}

/** Original requests allow schema parsing after a process restart. */
export interface BatchResultsOptions {
  requests: BatchRequest[];
}

/** One batch outcome, matched by custom_id rather than response order. */
export interface BatchResult {
  custom_id: string;
  result:
    | { type: 'succeeded'; response: RespondResult<unknown> }
    | { type: 'errored'; error: unknown }
    | { type: 'canceled' }
    | { type: 'expired' };
}
/* eslint-enable @typescript-eslint/naming-convention -- Batch identifiers end here. */

/** Native batch submission and lifecycle operations. */
export interface ClientBatches {
  create(params: BatchCreateParams): Promise<MessageBatch>;
  retrieve(id: string): Promise<MessageBatch>;
  cancel(id: string): Promise<MessageBatch>;
  results(id: string, options: BatchResultsOptions): AsyncIterable<BatchResult>;
}

interface Dependencies {
  client(): Anthropic;
  assertAllowed(): void;
  params(request: RespondRequest): MessageCreateParamsNonStreaming;
  parse(message: Message, request: RespondRequest): RespondResult<unknown>;
}

function requestMap(requests: BatchRequest[]): Map<string, RespondRequest> {
  if (!Array.isArray(requests) || requests.length === 0)
    throw new Error('A batch requires at least one request.');
  const result = new Map<string, RespondRequest>();
  for (const request of requests) {
    if (!request.custom_id || result.has(request.custom_id)) {
      throw new Error('Batch custom_id values must be nonempty and unique.');
    }
    result.set(request.custom_id, request.params);
  }
  return result;
}

/** Adapts the SDK batch resource without polling or submitting warmup requests. */
class Batches implements ClientBatches {
  private readonly pending = new Set<Promise<void>>();

  constructor(private readonly dependencies: Dependencies) {}

  private start() {
    this.dependencies.assertAllowed();
    let finish!: () => void;
    const settled = new Promise<void>((resolve) => {
      finish = resolve;
    });
    this.pending.add(settled);
    return () => {
      this.pending.delete(settled);
      finish();
    };
  }

  private async run<T>(task: () => Promise<T>): Promise<T> {
    const finish = this.start();
    try {
      return await task();
    } finally {
      finish();
    }
  }

  async create(request: BatchCreateParams): Promise<MessageBatch> {
    requestMap(request.requests);
    return this.run(async () =>
      this.dependencies.client().messages.batches.create({
        requests: request.requests.map((item) => ({
          // eslint-disable-next-line @typescript-eslint/naming-convention -- The native batch API uses custom_id.
          custom_id: item.custom_id,
          params: this.dependencies.params(item.params),
        })),
      }),
    );
  }

  async retrieve(id: string): Promise<MessageBatch> {
    return this.run(async () =>
      this.dependencies.client().messages.batches.retrieve(id),
    );
  }

  async cancel(id: string): Promise<MessageBatch> {
    return this.run(async () =>
      this.dependencies.client().messages.batches.cancel(id),
    );
  }

  async *results(
    id: string,
    options: BatchResultsOptions,
  ): AsyncIterable<BatchResult> {
    const requests = requestMap(options.requests);
    const finish = this.start();
    try {
      const stream = await this.dependencies.client().messages.batches.results(id);
      for await (const item of stream) {
        const request = requests.get(item.custom_id);
        if (!request) {
          throw new Error(
            `Unknown or duplicate batch custom_id: ${item.custom_id}.`,
          );
        }
        const result =
          item.result.type === 'succeeded'
            ? {
                type: 'succeeded' as const,
                response: this.dependencies.parse(item.result.message, request),
              }
            : item.result;
        // eslint-disable-next-line @typescript-eslint/naming-convention -- The native batch API uses custom_id.
        yield { custom_id: item.custom_id, result };
        requests.delete(item.custom_id);
      }
      if (requests.size)
        throw new Error('Batch results are missing requested custom_id values.');
    } finally {
      finish();
    }
  }

  async drain(): Promise<void> {
    await Promise.all(this.pending);
  }
}

/** Creates native batch operations and a local drain hook. */
export function createBatches(dependencies: Dependencies) {
  const batches = new Batches(dependencies);
  return { batches, drain: async () => batches.drain() };
}
