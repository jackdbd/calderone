const base_config = require('../../config/semantic-release.cjs')

// git commit message made by the semantic-relase bot //////////////////////////
// This commit message should be different for each package.
// The rest of the semantic-release configuration should stay the same.
// https://github.com/semantic-release/git#message
const message =
  'chore(content-security-policy): release v.${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
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
  branches: [...base_config.branches],
  plugins: [...base_config.plugins, git]
}

// console.log('=== semantic-release (content-security-policy) ===', config)

module.exports = config
