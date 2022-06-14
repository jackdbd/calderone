// https://github.com/semantic-release/changelog
const changelog = [
  '@semantic-release/changelog',
  {
    changelogFile: 'CHANGELOG.md',
    changelogTitle: '# CHANGELOG'
  }
]

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
// Do NOT set npmPublish here. Instead, set "private": true or "private": false
// in the package.json of each monorepo package.
// See alse the release.yaml GitHub workflow.
const npm = ['@semantic-release/npm', { pkgRoot: '.' }]

const commitlint_config_path = '../../config/commitlint.cjs'
// const commitlint_config_path = path.resolve('config', 'commitlint.cjs')
// console.log('commitlint config', commitlint_config_path)

// I prefer to keep the configuration for the commit linter in
// config/commitlint.cjs, so I can run npm run lint even when I am not releasing
// (I like to lint commits with a pre-push git hook).
// Since in config/commitlint.cjs I am using conventional commits, these 2
// configurations for @semantic-release/commit-analyzer are equivalent:
// 1. config: './config/commitlint.cjs'
// 2. preset: 'conventionalcommits'
// https://github.com/semantic-release/commit-analyzer
const commit_analyzer = [
  '@semantic-release/commit-analyzer',
  {
    config: commitlint_config_path
  }
]

// https://github.com/semantic-release/release-notes-generator
const release_notes_generator = [
  '@semantic-release/release-notes-generator',
  {
    config: commitlint_config_path
  }
]

module.exports = {
  changelog,
  commit_analyzer,
  github,
  npm,
  release_notes_generator
}
