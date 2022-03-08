const base_config = require('../../config/semantic-release.cjs')
const {
  isPublishingToArtifactRegistry,
  releaseMessage
} = require('../../config/utils.cjs')

// https://github.com/semantic-release/github
// I am not using the github plugin when publishing on Artifact Registry because
// I use Artifact Registry to test the release process, and I don't want to create
// a GitHub release when doing it.
const github = [
  '@semantic-release/github',
  {
    assets: [
      { path: 'README.md' },
      { path: 'LICENSE' },
      { path: 'CHANGELOG.md' }
    ]
  }
]

// https://github.com/semantic-release/npm
const npm = [
  '@semantic-release/npm',
  { npmPublish: true, pkgRoot: './to-publish' }
]

// The git plugin must be called AFTER the npm plugin. See here:
// https://github.com/semantic-release/git#examples
const git = [
  '@semantic-release/git',
  {
    assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
    message: releaseMessage()
  }
]

let config = {}
if (isPublishingToArtifactRegistry()) {
  config = {
    ...base_config,
    ci: false,
    // plugins: [...base_config.plugins, npm]
    plugins: [...base_config.plugins]
  }
} else {
  config = {
    ...base_config,
    ci: true,
    // plugins: [...base_config.plugins, npm, github, git]
    plugins: [...base_config.plugins, github, git]
  }
}

module.exports = config
