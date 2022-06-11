const base_config = require('../../config/semantic-release.cjs')
const { github, npm } = require('../../config/semantic-release-plugins.cjs')

// git commit message made by the semantic-relase bot //////////////////////////
// This commit message should be different for each package.
// The rest of the semantic-release configuration should stay the same.
// https://github.com/semantic-release/git#message
const message =
  'chore(utils): release v.${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
////////////////////////////////////////////////////////////////////////////////

const git = [
  '@semantic-release/git',
  {
    assets: ['CHANGELOG.md', 'package.json'],
    message
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
