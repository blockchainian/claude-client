import tseslint from 'typescript-eslint';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';

export const typeRules = [
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@eslint-community/eslint-comments': eslintComments,
    },
    rules: {
      'no-restricted-syntax': ['error', {
        selector: 'TSTypeAliasDeclaration > TSUnionType > :matches(TSNullKeyword, TSUndefinedKeyword)',
        message: '6.2.1: Add null or undefined where a type alias is used, not to the alias union.',
      }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@eslint-community/eslint-comments/require-description': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': true, 'ts-expect-error': true, 'ts-nocheck': true, 'ts-check': false,
      }],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-ignore': true, 'ts-expect-error': 'allow-with-description', 'ts-nocheck': true, 'ts-check': false,
      }],
    },
  },
];
