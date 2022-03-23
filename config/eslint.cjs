const prettier_config = require('./prettier.cjs')

const config = {
  extends: [
    // https://eslint.org/docs/rules/
    'eslint:recommended',
    // https://typescript-eslint.io/docs/linting/
    'plugin:@typescript-eslint/recommended',
    // plugin:prettier/recommended must be the last extension
    // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error', prettier_config]
  }
}

module.exports = config
