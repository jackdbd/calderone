#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/clean.mjs

const { stdout: s1 } =
  await $`cat package.json | jq .name | sed s'/@jackdbd\\///' | sed s'/"//g'`

const { stdout: s2 } = await $`basename ${process.env.PWD}`

if (s1 !== s2) {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}
const package_root = process.env.PWD

const patterns = [
  path.join(package_root, '.ae'),
  path.join(package_root, '.gcloudignore'),
  path.join(package_root, '.npmignore'),
  path.join(package_root, 'coverage/'),
  path.join(package_root, 'lib/'),
  path.join(package_root, 'tsconfig.tsbuildinfo')
]

await $`rimraf ${patterns}`
