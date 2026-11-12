# @blockchainian/claude-client

An ESM TypeScript client for the Claude Messages API, built on `@anthropic-ai/sdk`. It runs calls with a concurrency limit, returns structured JSON output and caches the instructions across calls. Requires Node.js 22 or later.

```sh
npm install @blockchainian/claude-client
```

```ts
import { createClaudeClient } from '@blockchainian/claude-client';

const client = createClaudeClient({ concurrency: 20 });
try {
  const { output, usage } = await client.respond({
    model: 'claude-opus-5-5',
    effort: 'low',
    instructions: 'Answer in one word.',
    input: 'What color is the sky on a clear day?',
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: { answer: { type: 'string' } },
      required: ['answer'],
    },
  });
  console.log(output, usage);
} finally {
  await client.close();
}
```

The API key comes from the `apiKey` option and defaults to `ANTHROPIC_API_KEY`. With `schema`, the output is the parsed JSON reply; without it, the output is the reply text. `input` accepts a string or Messages content blocks, and `maxTokens` defaults to 16000. A reply that stops for any reason other than `end_turn` rejects the call.

The instructions are sent as a system prompt marked with `cache_control`. The first call for a given model, effort, instructions and schema runs alone, and the calls that share that prefix wait for it, so they read the prefix from the cache instead of each writing it. Keep the schema identical across calls, because a different schema misses the cache.

`usage` reports `inputTokens`, `cacheCreationInputTokens`, `cacheReadInputTokens`, `outputTokens` and `reasoningOutputTokens`. `inputTokens` excludes the cached tokens. Rate-limited and failed requests are retried by the SDK up to `maxRetries` times, which defaults to 4. `close()` waits for accepted calls and refuses further calls.

## Authentication

The default and the existing top-level `apiKey` option use API billing. To select it explicitly, pass `auth: { type: 'api-key', apiKey: '...' }`; omitting that key reads only `ANTHROPIC_API_KEY`. Do not combine `auth` with the top-level `apiKey` option.

Use `createClaudeClient({ auth: { type: 'account' } })` for the existing Claude Code account login. It reads `CLAUDE_CODE_OAUTH_TOKEN` first, then the `Claude Code-credentials` entry in macOS Keychain. On other systems it reads `.credentials.json` in `CLAUDE_CONFIG_DIR`, which defaults to `~/.claude`. This mode ignores `ANTHROPIC_API_KEY` and does not use a Console profile or fall back to API billing. Account requests retain the caller's instructions after the two protocol system blocks verified by the subscription PoC.

Stored credentials must have an unexpired access token. The client rereads the store when its cached token expires; it does not perform an OAuth refresh. Run `claude auth login` to renew expired credentials. Environment tokens have no stored expiry metadata; a revoked or expired token produces the SDK's authentication error. The account protocol was verified by a separate short-request PoC; this integration is covered by local HTTP tests and has not made live inference calls.

## Native batches

`client.batches` submits native Messages batches with API key authentication. Account authentication rejects batch operations; it never switches to API key billing. Batch submission does not send a warmup request. If a warmup is needed, call `respond()` explicitly with the same model, effort, instructions, schema and `cacheTtl` before creating the batch. Cache reuse depends on provider timing and minimum prompt lengths.

```ts
const requests = [
  {
    custom_id: 'file-1',
    params: {
      model: 'claude-opus-5-5',
      effort: 'low',
      instructions: 'Review the supplied file.',
      input: source,
      cacheTtl: '1h',
    },
  },
];
const batch = await client.batches.create({ requests });
const current = await client.batches.retrieve(batch.id);
// After current.processing_status becomes 'ended':
for await (const item of client.batches.results(batch.id, { requests })) {
  console.log(item.custom_id, item.result);
}
```

Persist the original `requests` together with the batch ID. Results require that manifest to match identifiers and parse structured outputs after a restart. Successful items contain `{ type: 'succeeded', response: { output, usage } }`; unsuccessful items preserve `errored`, `canceled` or `expired` outcomes. Results can arrive in any order. Unexpected identifiers, invalid structured JSON and unexpected stop reasons throw. `create`, `retrieve` and `cancel` return the SDK's native batch object. `close()` drains accepted local operations; it does not wait for server-side batch completion.

`cacheTtl` accepts `'5m'` and `'1h'` on both ordinary and batch requests. Omitting it preserves the API's five-minute cache lifetime. Longer retention has separate provider pricing and does not guarantee a cache hit.

## Development

```sh
npm ci
npm run check
npm test
npm run lint
npm run format:check
npm run build
```

The tests use Node's test runner with a local HTTP server. One test calls the live API and runs only when `ANTHROPIC_API_KEY` is set. The code follows `STYLES.md`, and ESLint and Prettier enforce its "Rules enforced by lint" table.
