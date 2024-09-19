const config = {
  // https://jestjs.io/docs/configuration#globals-object
  globals: {},

  testMatch: [`<rootDir>/__tests__/**/*.test.{js,mjs}`],

  // 5s is the default value for slowTestThreshold.
  // https://jestjs.io/docs/configuration#slowtestthreshold-number
  slowTestThreshold: 5,

  // https://jestjs.io/docs/configuration#testenvironment-string
  testEnvironment: 'node',

  // jest-circus/runner is the default value for testRunner.
  // https://jestjs.io/docs/configuration#testrunner-string
  testRunner: 'jest-circus/runner',

  // 5000ms is the default value for testTimeout.
  // https://jestjs.io/docs/configuration#testtimeout-number

  transform: {}
}

// console.log('=== Jest config ===', config)

module.exports = config
