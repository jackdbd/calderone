#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package):
// ../../scripts/copy-dotfiles.mjs

if (process.env.BUILD_ID) {
  console.log(chalk.yellow('looks like you are on Cloud Build'))
} else {
  console.log(chalk.yellow('looks like you are NOT on Cloud Build'))
}

const pkg_root = process.env.PWD
const monorepo_root = path.join(pkg_root, '..', '..')
const config_root = path.join(monorepo_root, 'config')

await $`cp ${config_root}/.gcloudignore ${pkg_root}/.gcloudignore`
await $`cp ${config_root}/.npmignore ${pkg_root}/.npmignore`
