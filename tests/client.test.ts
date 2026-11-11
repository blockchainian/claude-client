import assert from 'node:assert/strict';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';

import { createClaudeClient } from '../src/index.js';

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: { answer: { type: 'string' } },
  required: ['answer'],
};

interface Recorder {
  bodies: unknown[];
  events: string[];
  maxActive: number;
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk as Uint8Array));
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

// Records each request, holds it briefly and rejects it as invalid.
async function handle(
  recorder: Recorder,
  active: { count: number },
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  active.count++;
  recorder.maxActive = Math.max(recorder.maxActive, active.count);
  recorder.bodies.push(await readJson(request));
  recorder.events.push('start');
  await delay(30);
  recorder.events.push('end');
  active.count--;
  response.statusCode = 400;
  response.setHeader('content-type', 'application/json');
  response.end(
    JSON.stringify({
      type: 'error',
      error: { type: 'invalid_request_error', message: 'Rejected by test.' },
    }),
  );
}

async function withServer(
  run: (recorder: Recorder) => Promise<void>,
): Promise<void> {
  const recorder: Recorder = { bodies: [], events: [], maxActive: 0 };
  const active = { count: 0 };
  const server = createServer((request, response) => {
    void handle(recorder, active, request, response);
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address() as AddressInfo;
  const baseUrl = process.env['ANTHROPIC_BASE_URL'];
  process.env['ANTHROPIC_BASE_URL'] = `http://127.0.0.1:${port}`;
  try {
    await run(recorder);
  } finally {
    if (baseUrl === undefined) delete process.env['ANTHROPIC_BASE_URL'];
    else process.env['ANTHROPIC_BASE_URL'] = baseUrl;
    server.close();
  }
}

test('rejects an invalid concurrency', () => {
  assert.throws(() => createClaudeClient({ concurrency: 0, apiKey: 'key' }), {
    message: 'Invalid concurrency.',
  });
});

test('rejects a missing API key', () => {
  assert.throws(() => createClaudeClient({ apiKey: '' }), {
    message: 'Missing apiKey or ANTHROPIC_API_KEY.',
  });
});

test('caches the instructions and sends the schema as the output format', async () => {
  await withServer(async (recorder) => {
    const client = createClaudeClient({ apiKey: 'key', maxRetries: 0 });
    const request = {
      model: 'claude-opus-5-5',
      effort: 'low' as const,
      instructions: 'Reply briefly.',
      input: 'Say hello.',
      schema,
    };
    await assert.rejects(client.respond(request), { status: 400 });
    /* eslint-disable @typescript-eslint/naming-convention -- The Messages API uses snake_case fields. */
    assert.deepEqual(recorder.bodies, [
      {
        model: 'claude-opus-5-5',
        max_tokens: 16_000,
        output_config: { effort: 'low', format: { type: 'json_schema', schema } },
        system: [
          {
            type: 'text',
            text: 'Reply briefly.',
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: 'Say hello.' }],
      },
    ]);
    /* eslint-enable @typescript-eslint/naming-convention -- The snake_case Messages API fields end here. */
  });
});

test('runs the first call of a prompt alone, then up to the concurrency', async () => {
  await withServer(async (recorder) => {
    const client = createClaudeClient({
      concurrency: 2,
      apiKey: 'key',
      maxRetries: 0,
    });
    const request = {
      model: 'claude-opus-5-5',
      effort: 'low' as const,
      instructions: 'Reply briefly.',
      input: 'Say hello.',
    };
    const calls = Array.from({ length: 5 }, async () => client.respond(request));
    const results = await Promise.allSettled(calls);
    await client.close();
    assert.ok(results.every((result) => result.status === 'rejected'));
    assert.deepEqual(recorder.events.slice(0, 2), ['start', 'end']);
    assert.equal(recorder.maxActive, 2);
    await assert.rejects(client.respond(request), {
      message: 'Claude client is closed.',
    });
  });
});

test(
  'answers with structured output and reports cache usage',
  { skip: !process.env['ANTHROPIC_API_KEY'] && 'ANTHROPIC_API_KEY is not set' },
  async () => {
    const client = createClaudeClient();
    const { output, usage } = await client.respond({
      model: 'claude-opus-5-5',
      effort: 'low',
      instructions: 'Answer in one word.',
      input: 'What color is the sky on a clear day?',
      schema,
    });
    assert.equal(typeof (output as { answer: unknown }).answer, 'string');
    assert.ok(usage.inputTokens > 0 && usage.outputTokens > 0);
    assert.equal(typeof usage.cacheReadInputTokens, 'number');
    assert.equal(typeof usage.cacheCreationInputTokens, 'number');
  },
);
