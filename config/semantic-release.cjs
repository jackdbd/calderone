const path = require('node:path')

/**
 * Configuration for semantic-release and multi-semantic-release.
 *
 * multi-semantic-release requires a semantic release config to be present in
 * EACH package and/or declared in the repo root.
 * This config file is executed from EACH PACKAGE root, not from the monorepo root.
 *
 * https://github.com/qiwi/multi-semantic-release#configuration
 */

// const commitlint_config_path = '../../config/commitlint.cjs'
const commitlint_config_path = path.resolve('config', 'commitlint.cjs')
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

// https://github.com/semantic-release/changelog
const changelog = [
  '@semantic-release/changelog',
  {
    changelogFile: 'CHANGELOG.md',
    changelogTitle: '# CHANGELOG'
  }
]

const config = {
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches
  branches: [
    'main',
    'next',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true }
  ],
  ci: true,
  // each package in this monorepo extends this `plugins` array
  plugins: [commit_analyzer, release_notes_generator, changelog],
  tagFormat: 'v${version}'
}

module.exports = config
