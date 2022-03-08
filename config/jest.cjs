const project = (package_name) => {
  let color
  if (package_name.indexOf('checks') === 0) {
    color = 'yellow'
  } else if (package_name.indexOf('schemas') === 0) {
    color = 'magenta'
  } else if (package_name.indexOf('telegram') === 0) {
    color = 'blue'
  } else if (package_name.indexOf('utils') === 0) {
    color = 'red'
  } else {
    color = 'white'
  }

  return {
    // I like to make Jest stop running tests after a few failures
    // https://jestjs.io/docs/configuration#bail-number--boolean
    bail: 3,

    // https://jestjs.io/docs/configuration#clearmocks-boolean
    clearMocks: true,

    // collectCoverage: false,
    // https://jestjs.io/docs/configuration#coveragereporters-arraystring--string-options
    coverageReporters: ['html', 'json', 'lcov'],

    // https://jestjs.io/docs/configuration#displayname-string-object
    displayName: {
      name: package_name,
      color
    },

    // https://jestjs.io/docs/configuration#errorondeprecated-boolean
    errorOnDeprecated: true,

    globals: {},

    moduleFileExtensions: ['js', 'mjs'],

    moduleNameMapper: {},

    testMatch: [`<rootDir>/packages/${package_name}/**/*.test.{js,mjs}`],

    // 5s is the default value for slowTestThreshold, but I keep it here to remember it.
    // https://jestjs.io/docs/configuration#slowtestthreshold-number
    slowTestThreshold: 5,

    // https://jestjs.io/docs/configuration#testenvironment-string
    testEnvironment: 'node',

    // jest-circus/runner is the default value for testRunner, but I keep it here to remember it.
    // https://jestjs.io/docs/configuration#testrunner-string
    testRunner: 'jest-circus/runner',

    // 5000ms is the default value for testTimeout.
    // https://jestjs.io/docs/configuration#testtimeout-number
    testTimeout: 5000,

    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    // https://jestjs.io/docs/ecmascript-modules
    transform: {}
  }
}

// https://jestjs.io/docs/configuration#projects-arraystring--projectconfig
const projects = [project('checks'), project('schemas'), project('utils')]

const config = {
  projects,
  // https://jestjs.io/docs/configuration#verbose-boolean
  verbose: true
}

module.exports = config
