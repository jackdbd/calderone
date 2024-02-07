// https://jestjs.io/docs/configuration
const config = {
  globals: {},
  testMatch: [`<rootDir>/__tests__/**/*.test.{js,mjs}`],
  testEnvironment: 'node',
  testTimeout: 5000,
  transform: {}
}

// console.log('=== Jest config ===', config)

module.exports = config
