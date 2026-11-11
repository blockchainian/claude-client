import tseslint from 'typescript-eslint';
import { sourceRules } from './rules/source.js';
import { languageRules } from './rules/language.js';
import { namingRules } from './rules/naming.js';
import { typeRules } from './rules/types.js';
import { commentRules } from './rules/comments.js';

function combineRestrictions(configs) {
  const intersections = [];
  const result = configs.map((config) => {
    const restriction = config.rules?.['no-restricted-syntax'];
    if (!restriction) return config;
    const { 'no-restricted-syntax': omitted, ...rules } = config.rules;
    const current = {
      ...config,
      rules: { 'no-restricted-syntax': restriction },
    };
    delete current.plugins;
    const combinations = intersections.map((previous) => ({
      files: (previous.files ?? ['**/*']).flatMap((left) =>
        (current.files ?? ['**/*']).map((right) => [
          ...[left].flat(),
          ...[right].flat(),
        ]),
      ),
      ignores: [...(previous.ignores ?? []), ...(current.ignores ?? [])],
      rules: {
        'no-restricted-syntax': [
          'error',
          ...previous.rules['no-restricted-syntax'].slice(1),
          ...restriction.slice(1),
        ],
      },
    }));
    intersections.push(current, ...combinations);
    return { ...config, rules };
  });
  return [...result, ...intersections];
}

export function styleConfig({ tsconfigRootDir, tsconfigPath }) {
  const typescriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'];
  const typed = (configs) =>
    configs.map((config) => ({
      ...config,
      files: config.files
        ? typescriptFiles.flatMap((file) =>
            config.files.map((scope) => [file, ...[scope].flat()]),
          )
        : typescriptFiles,
    }));
  const configs = combineRestrictions([
    {
      files: typescriptFiles,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ...(tsconfigPath === undefined
            ? { projectService: true }
            : { project: tsconfigPath }),
          tsconfigRootDir,
        },
      },
      plugins: { '@typescript-eslint': tseslint.plugin },
    },
    ...sourceRules,
    ...languageRules,
    ...typed(namingRules),
    ...typed(typeRules),
    ...commentRules,
  ]);
  return [
    ...configs,
    {
      ...tseslint.configs.disableTypeChecked,
      files: ['**/*.{js,jsx,mjs,cjs}'],
      plugins: { '@typescript-eslint': tseslint.plugin },
      rules: {
        ...tseslint.configs.disableTypeChecked.rules,
        '@typescript-eslint/naming-convention': 'off',
      },
    },
  ];
}
