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
// Do not set npmPublish here. Instead, set "private": true or "private": false
// in the package.json of each monorepo package.
const npm = ['@semantic-release/npm', { pkgRoot: '.' }]

module.exports = { github, npm }
