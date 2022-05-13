// https://github.com/semantic-release/github
const github = [
  '@semantic-release/github',
  {
    assets: [
      { path: 'CHANGELOG.md' },
      { path: 'LICENSE' },
      { path: 'README.md' }
    ]
  }
]

// https://github.com/semantic-release/npm
const npm = ['@semantic-release/npm', { npmPublish: true, pkgRoot: './lib' }]

module.exports = { github, npm }
