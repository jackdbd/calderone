#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/clean.mjs

// The script utils.mjs depends on @jackdbd/checks, but since we are cleaning
// all packages in THIS script, we can't depend on any package. So we can't
// import utils.mjs. The following code is just the function
// throwIfInvokedFromMonorepoRoot copy-pasted here.
const pwd = process.env.PWD
const { name } = require(`${pwd}/package.json`)
if (name === 'root') {
  throw new Error(
    chalk.red(
      `you invoked this script from ${pwd}. This script should be invoked from a package root instead.`
    )
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
