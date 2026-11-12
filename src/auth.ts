import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import Anthropic from '@anthropic-ai/sdk';
import type { TextBlockParam } from '@anthropic-ai/sdk/resources/messages';

/** Selects API billing or the existing Claude Code account login. */
export type Authentication =
  { type: 'account' } | { type: 'api-key'; apiKey?: string };

/** Authentication inputs shared by Messages and Batch clients. */
interface AuthenticationOptions {
  apiKey?: string;
  auth?: Authentication;
  maxRetries?: number;
}

interface AuthenticationContext {
  client(): Anthropic;
  system(instructions: string, cacheTtl?: '5m' | '1h'): TextBlockParam[];
  requestOptions: Anthropic.RequestOptions;
  account: boolean;
}

interface AccountCredential {
  accessToken: string;
  expiresAt: number;
}

const LOGIN_ERROR =
  'Claude Code login is missing or expired. Run `claude auth login` and try again.';

/** Validates the credential shape stored by the official Claude Code login. */
export function parseAccountCredential(raw: string): AccountCredential {
  let stored: { claudeAiOauth?: Partial<AccountCredential> };
  try {
    stored = JSON.parse(raw) as typeof stored;
  } catch {
    throw new Error('Invalid Claude Code credential storage.');
  }
  const credential = stored?.claudeAiOauth;
  if (
    !credential ||
    typeof credential.accessToken !== 'string' ||
    !credential.accessToken ||
    typeof credential.expiresAt !== 'number' ||
    !Number.isFinite(credential.expiresAt)
  ) {
    throw new Error('Invalid Claude Code credential storage.');
  }
  if (credential.expiresAt <= Date.now()) throw new Error(LOGIN_ERROR);
  return { accessToken: credential.accessToken, expiresAt: credential.expiresAt };
}

function accountCredential(): AccountCredential {
  const token = process.env['CLAUDE_CODE_OAUTH_TOKEN'];
  if (token) return { accessToken: token, expiresAt: Infinity };
  let raw: string;
  try {
    raw =
      process.platform === 'darwin'
        ? execFileSync(
            '/usr/bin/security',
            ['find-generic-password', '-s', 'Claude Code-credentials', '-w'],
            {
              encoding: 'utf8',
              stdio: ['ignore', 'pipe', 'pipe'],
              timeout: 10_000,
            },
          )
        : readFileSync(
            join(
              process.env['CLAUDE_CONFIG_DIR'] ?? join(homedir(), '.claude'),
              '.credentials.json',
            ),
            'utf8',
          );
  } catch {
    throw new Error(LOGIN_ERROR);
  }
  return parseAccountCredential(raw);
}

function accountClient(
  credential: AccountCredential,
  maxRetries?: number,
): Anthropic {
  return new Anthropic({
    apiKey: null,
    authToken: credential.accessToken,
    maxRetries,
    /* eslint-disable @typescript-eslint/naming-convention -- HTTP header names use hyphens. */
    defaultHeaders: {
      'anthropic-beta': 'claude-code-20250219,oauth-2025-04-20',
      'x-app': 'cli',
      'user-agent': 'claude-cli/2.1.322 (external, sdk-cli)',
    },
    /* eslint-enable @typescript-eslint/naming-convention -- HTTP header fields end here. */
  });
}

function systemBlocks(
  account: boolean,
  instructions: string,
  cacheTtl?: '5m' | '1h',
): TextBlockParam[] {
  const prefix: TextBlockParam[] = account
    ? [
        {
          type: 'text',
          text: 'x-anthropic-billing-header: cc_version=2.1.322.93a; cc_entrypoint=sdk-cli;',
        },
        {
          type: 'text',
          text: "You are a Claude agent, built on Anthropic's Claude Agent SDK.",
        },
      ]
    : [];
  const cacheControl: { type: 'ephemeral'; ttl?: '5m' | '1h' } = {
    type: 'ephemeral',
  };
  if (cacheTtl) cacheControl.ttl = cacheTtl;
  return [
    ...prefix,
    {
      type: 'text',
      text: instructions,
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Messages wire fields use snake_case.
      cache_control: cacheControl,
    },
  ];
}

/** Creates credentials and the request format used by the selected login. */
export function createAuthentication({
  apiKey,
  auth,
  maxRetries,
}: AuthenticationOptions): AuthenticationContext {
  if (apiKey !== undefined && auth !== undefined)
    throw new Error('Do not pass apiKey and auth together.');
  const account = auth?.type === 'account';
  let expiresAt = 0;
  let client: Anthropic;
  if (!account) {
    let key = apiKey ?? process.env['ANTHROPIC_API_KEY'];
    if (auth?.type === 'api-key')
      key = auth.apiKey ?? process.env['ANTHROPIC_API_KEY'];
    if (!key) throw new Error('Missing apiKey or ANTHROPIC_API_KEY.');
    client = new Anthropic({ apiKey: key, maxRetries });
  }
  function getClient(): Anthropic {
    if (account && expiresAt <= Date.now()) {
      const credential = accountCredential();
      expiresAt = credential.expiresAt;
      client = accountClient(credential, maxRetries);
    }
    return client;
  }
  function system(instructions: string, cacheTtl?: '5m' | '1h'): TextBlockParam[] {
    return systemBlocks(account, instructions, cacheTtl);
  }
  const requestOptions: Anthropic.RequestOptions = account
    ? { query: { beta: true } }
    : {};
  return { client: getClient, system, requestOptions, account };
}
