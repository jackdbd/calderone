#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/clean.mjs

const { name } = require(`${process.env.PWD}/package.json`)
if (name == 'root') {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

const package_root = process.env.PWD

const patterns = [
  path.join(package_root, '.ae', 'doc'),
  path.join(package_root, '.ae', 'temp'),
  path.join(package_root, '.gcloudignore'),
  path.join(package_root, '.npmignore'),
  path.join(package_root, 'coverage/'),
  path.join(package_root, 'lib/'),
  path.join(package_root, 'tsconfig.tsbuildinfo')
]

await $`rimraf ${patterns}`
