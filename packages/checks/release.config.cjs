const base_config = require('../../config/semantic-release.cjs')
const { github, npm } = require('../../config/semantic-release-plugins.cjs')

// https://github.com/semantic-release/git#message
const RELEASE_COMMIT_MESSAGE =
  'chore(checks): release v.${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'

const git = [
  '@semantic-release/git',
  {
    assets: ['CHANGELOG.md', 'package.json'],
    message: RELEASE_COMMIT_MESSAGE
  }
]

const config = {
  ...base_config,
  ci: true,
  // The git plugin must be called AFTER the npm plugin. See here:
  // https://github.com/semantic-release/git#examples
  // https://semantic-release.gitbook.io/semantic-release/support/faq#why-is-the-package.jsons-version-not-updated-in-my-repository
  plugins: [...base_config.plugins, npm, github, git]
}

module.exports = config
