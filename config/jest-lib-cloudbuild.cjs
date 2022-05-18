const config = {
  bail: 3,
  ci: true,
  clearMocks: true,
  errorOnDeprecated: true,
  globals: {},
  moduleFileExtensions: ['js', 'mjs'],
  moduleNameMapper: {},
  slowTestThreshold: 5,
  testEnvironment: 'node',
  testMatch: [`<rootDir>/__tests__/**/*.test.{js,mjs}`],
  testRunner: 'jest-circus/runner',
  testTimeout: 5000,
  transform: {},
  verbose: true
}

module.exports = config
