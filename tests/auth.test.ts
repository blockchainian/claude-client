import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';

import { parseAccountCredential } from '../src/auth.js';

import { createClaudeClient } from '../src/index.js';

async function handleAccountRequest(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk as Uint8Array));
  const body = JSON.parse(Buffer.concat(chunks).toString()) as {
    system: Array<{ text: string }>;
  };
  assert.equal(request.headers.authorization, 'Bearer test-account-token');
  assert.equal(request.headers['x-api-key'], undefined);
  assert.equal(request.url, '/v1/messages?beta=true');
  assert.equal(
    request.headers['anthropic-beta'],
    'claude-code-20250219,oauth-2025-04-20',
  );
  assert.equal(
    body.system[0]?.text,
    'x-anthropic-billing-header: cc_version=2.1.322.93a; cc_entrypoint=sdk-cli;',
  );
  assert.equal(
    body.system[1]?.text,
    "You are a Claude agent, built on Anthropic's Claude Agent SDK.",
  );
  assert.equal(body.system[2]?.text, 'Caller instructions.');
  response.setHeader('content-type', 'application/json');
  /* eslint-disable @typescript-eslint/naming-convention -- The successful PoC response uses Messages wire field names. */
  response.end(
    JSON.stringify({
      id: 'local-test',
      type: 'message',
      role: 'assistant',
      model: 'claude-haiku-5-5',
      content: [{ type: 'text', text: 'OK' }],
      stop_reason: 'end_turn',
      stop_sequence: null,
      usage: { input_tokens: 46, output_tokens: 4 },
    }),
  );
  /* eslint-enable @typescript-eslint/naming-convention -- Wire response fields end here. */
}

// Uses the successful local subscription PoC's protocol and response fields.
test('account authentication preserves caller instructions and excludes API keys', async () => {
  const previous = { ...process.env };
  const server = createServer((request, response) => {
    void handleAccountRequest(request, response);
  });
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address() as AddressInfo;
  process.env['ANTHROPIC_BASE_URL'] = `http://127.0.0.1:${port}`;
  process.env['ANTHROPIC_API_KEY'] = 'must-not-be-used';
  process.env['CLAUDE_CODE_OAUTH_TOKEN'] = 'test-account-token';
  const client = createClaudeClient({ auth: { type: 'account' }, maxRetries: 0 });
  try {
    const result = await client.respond({
      model: 'claude-haiku-5-5',
      effort: 'low',
      instructions: 'Caller instructions.',
      input: 'Reply OK.',
    });
    assert.equal(result.output, 'OK');
  } finally {
    await client.close();
    process.env = previous;
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
});

test('rejects conflicting authentication options', () => {
  assert.throws(
    () => createClaudeClient({ apiKey: 'key', auth: { type: 'account' } }),
    /apiKey and auth/,
  );
});

test('explicit API key authentication never falls back to account tokens', () => {
  const previous = process.env['ANTHROPIC_API_KEY'];
  delete process.env['ANTHROPIC_API_KEY'];
  try {
    assert.throws(
      () => createClaudeClient({ auth: { type: 'api-key' } }),
      /Missing apiKey/,
    );
  } finally {
    if (previous !== undefined) process.env['ANTHROPIC_API_KEY'] = previous;
  }
});

test('expired stored credentials fail before any inference request', () => {
  assert.throws(
    () =>
      parseAccountCredential(
        JSON.stringify({
          claudeAiOauth: { accessToken: 'not-a-real-token', expiresAt: 0 },
        }),
      ),
    /claude auth login/,
  );
  assert.throws(() => parseAccountCredential('{'), /Invalid Claude Code/);
  assert.throws(
    () =>
      parseAccountCredential(
        JSON.stringify({ claudeAiOauth: { accessToken: 'token' } }),
      ),
    /Invalid Claude Code/,
  );
  assert.deepEqual(
    parseAccountCredential(
      JSON.stringify({
        claudeAiOauth: {
          accessToken: 'not-a-real-token',
          expiresAt: Date.now() + 60_000,
        },
      }),
    ).accessToken,
    'not-a-real-token',
  );
});
