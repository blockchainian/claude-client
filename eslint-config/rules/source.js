import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export const sourceRules = [
  {
    plugins: { import: importPlugin },
    rules: {
      'no-irregular-whitespace': [
        'error',
        {
          skipStrings: false,
          skipComments: false,
          skipRegExps: false,
          skipTemplates: false,
        },
      ],
      'no-octal-escape': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../../*', '**/../../../*'],
              message: '3.3.1 Limit parent directory steps in import paths.',
            },
          ],
        },
      ],
      // 3.4.1 requires a legacy .eslintrc even with flat config; enabling it aborts lint.
      'import/no-unused-modules': 'off',
      'import/no-mutable-exports': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/no-extraneous-class': [
        'error',
        { allowConstructorOnly: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: true },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-namespace': [
        'error',
        { allowDeclarations: true, allowDefinitionFiles: true },
      ],
    },
  },
];
