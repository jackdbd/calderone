const project = (package_name) => {
  // Jest uses chalk for colors
  // https://github.com/chalk/chalk
  let color
  if (package_name.indexOf('checks') === 0) {
    color = 'yellow'
  } else if (package_name.indexOf('firestore') === 0) {
    color = 'red'
  } else if (package_name.indexOf('keap') === 0) {
    color = 'green'
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

    // The order in which the mappings are defined matters. Patterns are checked
    // one by one until one fits. The most specific rule should be listed first.
    // https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
    moduleNameMapper: {
      '@jackdbd/checks/(.*)': '<rootDir>/packages/checks/lib/$1.js',
      '@jackdbd/notifications/(.*)':
        '<rootDir>/packages/notifications/lib/$1.js',
      '@jackdbd/utils/(.*)':
        '<rootDir>/packages/telegram-text-messages/lib/$1.js',
      '@jackdbd/utils/(.*)': '<rootDir>/packages/utils/lib/$1.js',
      '@jackdbd/(.*)': '<rootDir>/packages/$1/lib/index.js'
    },

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
const projects = [
  project('audit'),
  project('checks'),
  project('cloud-scheduler-utils'),
  project('fattureincloud-client'),
  project('firestore-utils'),
  project('hapi-healthcheck-plugin'),
  project('hapi-ip-whitelist-plugin'),
  project('keap-client'),
  project('notifications'),
  project('schemas'),
  project('secret-manager-utils'),
  project('stripe-utils'),
  project('telegram-bot'),
  project('telegram-text-messages'),
  project('utils'),
  project('wasm-news'),
  project('webhooks')
]

const config = {
  projects,
  // https://jestjs.io/docs/configuration#verbose-boolean
  verbose: true
}

module.exports = config
