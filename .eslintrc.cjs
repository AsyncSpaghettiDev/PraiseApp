module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'standard'],
  ignorePatterns: ['.eslintrc.cjs', 'dist'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-extra-semi': 'error',
    semi: ['error', 'never'],
    'no-useless-constructor': 'off',
  },
  // overrides: [
  //   {
  //     files: ['**/*.dto.ts'],
  //     rules: {
  //       indent: 'off',
  //     },
  //   },
  // ],
}
