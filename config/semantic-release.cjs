/**
 * Configuration for semantic-release and multi-semantic-release.
 *
 * multi-semantic-release requires a semantic release config to be present in
 * EACH package and/or declared in the repo root.
 * This config file is executed from EACH PACKAGE root, not from the monorepo root.
 *
 * https://github.com/qiwi/multi-semantic-release#configuration
 */
const {
  changelog,
  commit_analyzer,
  github,
  npm,
  release_notes_generator
} = require('./semantic-release-plugins.cjs')

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
  // The git plugin must be called AFTER the npm plugin. See here:
  // https://github.com/semantic-release/git#examples
  // https://semantic-release.gitbook.io/semantic-release/support/faq#why-is-the-package.jsons-version-not-updated-in-my-repository
  plugins: [commit_analyzer, release_notes_generator, changelog, npm, github],
  tagFormat: 'v${version}'
}

// console.log('=== semantic-release (ROOT) ===', config)

module.exports = config
