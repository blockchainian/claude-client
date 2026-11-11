import tseslint from 'typescript-eslint';

const identifier = {
  leadingUnderscore: 'forbid',
  trailingUnderscore: 'forbid',
  custom: { regex: '^[A-Za-z0-9_]*$', match: true },
};

function conventions(componentFunctions = false) {
  return [
    'error',
    { selector: 'default', format: ['strictCamelCase'], ...identifier },
    { selector: 'typeLike', format: ['StrictPascalCase'], ...identifier },
    { selector: 'typeParameter', format: ['StrictPascalCase'], ...identifier },
    { selector: 'enumMember', format: ['UPPER_CASE'], ...identifier },
    {
      selector: 'variable', modifiers: ['const', 'global'],
      format: ['strictCamelCase', 'UPPER_CASE', ...(componentFunctions ? ['StrictPascalCase'] : [])],
      ...identifier,
    },
    {
      selector: 'classProperty', modifiers: ['static', 'readonly'],
      format: ['strictCamelCase', 'UPPER_CASE'], ...identifier,
    },
    {
      selector: ['variable', 'parameter'], modifiers: ['unused'],
      format: ['strictCamelCase'], ...identifier, leadingUnderscore: 'allow',
    },
    { selector: 'function', format: componentFunctions ? ['strictCamelCase', 'StrictPascalCase'] : ['strictCamelCase'], ...identifier },
    { selector: 'import', format: ['strictCamelCase', 'StrictPascalCase'], ...identifier },
    { selector: 'import', modifiers: ['namespace'], format: ['strictCamelCase'], ...identifier },
    // 5.2.4 explicitly permits these conventional namespace imports.
    { selector: 'import', modifiers: ['namespace'], filter: { regex: '^(\\$|THREE)$', match: true }, format: null },
  ];
}

export const namingRules = [
  {
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/naming-convention': conventions(),
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'after-used', argsIgnorePattern: '^_',
        varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_', reportUsedIgnorePattern: true,
      }],
    },
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: { '@typescript-eslint/naming-convention': conventions(true) },
  },
];
