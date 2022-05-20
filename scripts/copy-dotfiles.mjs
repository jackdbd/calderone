#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/copy-dotfiles.mjs

if (process.env.BUILD_ID) {
  console.log(chalk.yellow('looks like you are on Cloud Build'))
} else {
  console.log(chalk.yellow('looks like you are NOT on Cloud Build'))
}

const { name } = require(`${process.env.PWD}/package.json`)
if (name == 'root') {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')
const config_root = path.join(monorepo_root, 'config')

await $`cp ${config_root}/.gcloudignore ${package_root}/.gcloudignore`
await $`cp ${config_root}/.npmignore ${package_root}/.npmignore`
