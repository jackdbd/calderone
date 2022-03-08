const fs = require('node:fs')
const path = require('node:path')

const PUBLISH_DIRECTORY = 'to-publish'

const monorepoRoot = () => {
  let current_dir = path.resolve('.')
  while (!fs.existsSync(path.join(current_dir, '.git'))) {
    current_dir = path.join(current_dir, '..')
  }
  return current_dir
}

const packageRoot = (package_name) => {
  return path.join(monorepoRoot(), 'packages', package_name, PUBLISH_DIRECTORY)
}

/**
 * Message to be used by the semantic-release git plugin when creating a release
 * commit. It's defined here so all packages use a consistent release message.
 */
const releaseMessage = () => {
  return 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
}

const isPublishingToArtifactRegistry = () => true
// const isPublishingToArtifactRegistry = () => false

// https://github.com/semantic-release/changelog
const changelogPlugin = (package_root) => {
  console.log('🚀 changelogPlugin package_root', package_root)
  return [
    '@semantic-release/changelog',
    {
      changelogFile: path.join(package_root, 'CHANGELOG.md'),
      changelogTitle: '# CHANGELOG'
    }
  ]
}

// The git plugin must be called AFTER the npm plugin. See here:
// https://github.com/semantic-release/git#examples
const gitPlugin = (package_root) => {
  console.log('🚀 gitPlugin package_root', package_root)
  return [
    '@semantic-release/git',
    {
      assets: [
        path.join(package_root, 'CHANGELOG.md'),
        path.join(package_root, PUBLISH_DIRECTORY, 'package.json')
      ],
      message: releaseMessage()
    }
  ]
}

// https://github.com/semantic-release/github
const github_plugin = [
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
const npmPlugin = (package_root) => {
  console.log('🚀 npmPlugin package_root', package_root)
  return ['@semantic-release/npm', { npmPublish: true, pkgRoot: package_root }]
}

module.exports = {
  changelogPlugin,
  isPublishingToArtifactRegistry,
  gitPlugin,
  github_plugin,
  monorepoRoot,
  npmPlugin,
  packageRoot,
  PUBLISH_DIRECTORY,
  releaseMessage
}
