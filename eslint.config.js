import { styleConfig } from './eslint-config/index.js';

export default [
  ...styleConfig({
    tsconfigRootDir: import.meta.dirname,
    tsconfigPath: './tsconfig.json',
  }),
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    // no-unused-modules lists the files it checks by these extensions.
    settings: {
      'import/extensions': ['.ts'],
      'import/resolver': { typescript: { project: './tsconfig.json' } },
    },
    rules: {
      // 3.4.1 Export visibility; the entry point's exports are the package API.
      'import/no-unused-modules': [
        'error',
        { unusedExports: true, ignoreExports: ['src/index.ts'] },
      ],
    },
  },
];
