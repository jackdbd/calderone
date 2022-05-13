const base_config = require('../../config/semantic-release.cjs')
const { github } = require('../../config/semantic-release-plugins.cjs')

// https://github.com/semantic-release/git#message
const RELEASE_COMMIT_MESSAGE =
  'chore(stripe-utils): release v.${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'

// The git plugin must be called AFTER the npm plugin. See here:
// https://github.com/semantic-release/git#examples
const git = [
  '@semantic-release/git',
  {
    assets: ['CHANGELOG.md', 'package.json'],
    message: RELEASE_COMMIT_MESSAGE
  }
]

// https://github.com/semantic-release/npm
const npm = ['@semantic-release/npm', { npmPublish: false, pkgRoot: './lib' }]

const config = {
  ...base_config,
  ci: true,
  // The git plugin must be called AFTER the npm plugin. See here:
  // https://github.com/semantic-release/git#examples
  // https://semantic-release.gitbook.io/semantic-release/support/faq#why-is-the-package.jsons-version-not-updated-in-my-repository
  plugins: [...base_config.plugins, npm, github, git]
}

module.exports = config
