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
