import stylistic from '@stylistic/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export const languageRules = [
  {
    plugins: {
      '@stylistic': stylistic,
      unicorn,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'one-var': ['error', 'never'],
      'no-object-constructor': 'error',
      'guard-for-in': 'error',
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/new-parens': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'MethodDefinition[static=true][accessibility="private"]',
          message: '4.4.4.1: Use a module-local function instead of a private static method.',
        },
        {
          selector: 'MethodDefinition[static=true] ThisExpression',
          message: '4.4.4.3: Reference the class by name in static methods.',
        },
        {
          selector: 'PrivateIdentifier',
          message: '4.4.6.1: Use TypeScript visibility annotations instead of private identifiers.',
        },
        {
          selector: 'AssignmentExpression > MemberExpression.left:matches([property.name="prototype"][computed=false], [property.value="prototype"][computed=true]), AssignmentExpression > MemberExpression.left MemberExpression:matches([property.name="prototype"][computed=false], [property.value="prototype"][computed=true])',
          message: '4.4.8.1: Declare class members instead of assigning to prototypes.',
        },
        {
          selector: 'PropertyDefinition > ArrowFunctionExpression.value',
          message: '4.5.8: Use a class method instead of an arrow function property.',
        },
        {
          selector: ':matches(TSAsExpression, TSTypeAssertion)[typeAnnotation.type!="TSUnknownKeyword"] > :matches(TSAsExpression, TSTypeAssertion).expression[typeAnnotation.type!="TSUnknownKeyword"]',
          message: '4.8.6.2: Use unknown as the intermediate type in a double assertion.',
        },
        {
          selector: 'TSEnumDeclaration[const=true]',
          message: '4.10.3: Use a regular enum instead of a const enum.',
        },
      ],
      'func-style': ['error', 'declaration', { allowTypeAnnotation: true }],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'unicorn/no-array-callback-reference': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'no-shadow-restricted-names': 'error',
      '@stylistic/padded-blocks': ['error', { blocks: 'never' }],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      'no-multi-str': 'error',
      'prefer-template': 'error',
      'no-octal': 'error',
      'unicorn/number-literal-case': 'error',
      'no-implicit-coercion': ['error', { number: true, boolean: false, string: false }],
      'no-restricted-globals': ['error', 'parseFloat', 'parseInt'],
      'no-extra-boolean-cast': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      '@stylistic/no-extra-parens': 'error',
      'unicorn/throw-new-error': 'error',
      'no-empty': 'error',
      'default-case': ['error', { commentPattern: '^$' }],
      'default-case-last': 'error',
      'no-fallthrough': ['error', { commentPattern: '^$' }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-new-wrappers': 'error',
      'no-debugger': 'error',
      'no-with': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-extend-native': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-misused-spread': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/parameter-properties': ['error', { prefer: 'parameter-property' }],
      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'no-public',
        overrides: { parameterProperties: 'off' },
      }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/only-throw-error': ['error', { allowThrowingAny: false, allowThrowingUnknown: false }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' }],
      '@typescript-eslint/no-deprecated': 'error',
    },
  },
];
