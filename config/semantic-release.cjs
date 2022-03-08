/**
 * configuration for semantic-release and multi-semantic-release
 *
 * multi-semantic-release requires a semantic release config to be present in
 * EACH package or/and declared in repo root.
 * This config file is executed in EACH package root, not in the monorepo root.
 */

const commitlint_config_path = '../../config/commitlint.cjs'

// https://github.com/semantic-release/commit-analyzer
// I prefer to keep the configuration for the commit linter in
// config/commitlint.cjs, so I can run npm run lint even when I am not releasing
// (I like to lint commits with a pre-push git hook).
// Since in config/commitlint.cjs I am using conventional commits, these 2
// configurations for @semantic-release/commit-analyzer are equivalent:
// 1. config: './config/commitlint.cjs'
// 2. preset: 'conventionalcommits'
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

const config = {
  // https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches
  branches: [
    { name: 'main' },
    { name: 'develop', channel: 'alpha', prerelease: true },
    { name: 'beta', channel: 'beta', prerelease: true }
  ],
  ci: true,
  // The git plugin must be called AFTER the npm plugin. See here:
  // https://github.com/semantic-release/git#examples
  plugins: [commit_analyzer, release_notes_generator]
}

module.exports = config
