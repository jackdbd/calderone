// const { releaseMessage } = require('./utils.cjs')

// The git plugin must be called AFTER the npm plugin. See here:
// https://github.com/semantic-release/git#examples
const git = [
  '@semantic-release/git',
  {
    assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
    // https://github.com/semantic-release/git#message
    message:
      'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
  }
]

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

module.exports = { git, github, npm }
