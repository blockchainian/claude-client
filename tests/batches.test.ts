import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createClaudeClient } from '../src/index.js';

const params = {
  model: 'claude-opus-5-5',
  effort: 'low' as const,
  instructions: 'Reply briefly.',
  input: 'Hello.',
};

test('rejects empty batches before sending a request', async () => {
  const client = createClaudeClient({ apiKey: 'unused' });
  await assert.rejects(client.batches.create({ requests: [] }), /at least one/);
  await client.close();
});

test('rejects duplicate batch identifiers before sending a request', async () => {
  const client = createClaudeClient({ apiKey: 'unused' });
  // eslint-disable-next-line @typescript-eslint/naming-convention -- The batch API uses custom_id.
  const request = { custom_id: 'same', params };
  await assert.rejects(
    client.batches.create({ requests: [request, request] }),
    /unique/,
  );
  await client.close();
});

test('rejects native batches for account authentication without loading credentials', async () => {
  const client = createClaudeClient({ auth: { type: 'account' } });
  await assert.rejects(
    client.batches.create({
      requests: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- The batch API uses custom_id.
          custom_id: 'one',
          params,
        },
      ],
    }),
    /require API key/,
  );
  await assert.rejects(client.batches.retrieve('unused'), /require API key/);
  await assert.rejects(client.batches.cancel('unused'), /require API key/);
  await assert.rejects(async () => {
    for await (const result of client.batches.results('unused', {
      requests: [
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention -- The batch API uses custom_id.
          custom_id: 'one',
          params,
        },
      ],
    }))
      assert.fail(JSON.stringify(result));
  }, /require API key/);
  await client.close();
});

test('rejects batch operations after close', async () => {
  const client = createClaudeClient({ apiKey: 'unused' });
  await client.close();
  await assert.rejects(client.batches.retrieve('unused'), /closed/);
  await assert.rejects(client.batches.cancel('unused'), /closed/);
});

test('requires a nonempty manifest when reading results', async () => {
  const client = createClaudeClient({ apiKey: 'unused' });
  await assert.rejects(async () => {
    for await (const item of client.batches.results('unused', { requests: [] }))
      assert.fail(JSON.stringify(item));
  }, /at least one/);
  await client.close();
});

test('rejects duplicate manifest identifiers before reading results', async () => {
  const client = createClaudeClient({ apiKey: 'unused' });
  // eslint-disable-next-line @typescript-eslint/naming-convention -- The batch API uses custom_id.
  const request = { custom_id: 'same', params };
  await assert.rejects(async () => {
    for await (const item of client.batches.results('unused', {
      requests: [request, request],
    }))
      assert.fail(JSON.stringify(item));
  }, /unique/);
  await client.close();
});
