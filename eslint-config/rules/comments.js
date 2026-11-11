import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';

/** Enforces the comment and documentation rules in chapter 8. */
export const commentRules = [
  {
    plugins: { '@stylistic': stylistic, jsdoc },
    rules: {
      '@stylistic/multiline-comment-style': ['error', 'separate-lines'],
      'jsdoc/multiline-blocks': 'error',
      'jsdoc/require-asterisk-prefix': 'error',
      'jsdoc/check-tag-names': ['error', { typed: true }],
      'jsdoc/check-line-alignment': [
        'error',
        'never',
        { wrapIndent: '    ', tags: ['param', 'return', 'returns'] },
      ],
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: { esm: true, cjs: false },
          require: { FunctionDeclaration: false },
          contexts: [
            'Program > FunctionDeclaration',
            'Program > ClassDeclaration',
            'Program > VariableDeclaration > VariableDeclarator > *.init',
            'Program > TSInterfaceDeclaration',
            'Program > TSTypeAliasDeclaration',
            'Program > TSEnumDeclaration',
            'Program > ExportNamedDeclaration > :matches(FunctionDeclaration, ClassDeclaration, TSInterfaceDeclaration, TSTypeAliasDeclaration, TSEnumDeclaration)',
            'Program > ExportNamedDeclaration > VariableDeclaration > VariableDeclarator',
            'Program > ExportDefaultDeclaration > :matches(FunctionDeclaration, ClassDeclaration, ArrowFunctionExpression, FunctionExpression)',
          ],
        },
      ],
      'jsdoc/no-types': 'error',
    },
  },
];
