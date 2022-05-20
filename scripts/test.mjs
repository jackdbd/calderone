#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/test.mjs

const { stdout: s1 } =
  await $`cat package.json | jq .name | sed s'/@jackdbd\\///' | sed s'/"//g'`

const { stdout: s2 } = await $`basename ${process.env.PWD}`

if (s1 !== s2) {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

const package_root = process.env.PWD
// tr -d '\n' is to remove the newline character
const { stdout: package_name } = await $`basename ${package_root} | tr -d '\n'`
const monorepo_root = path.join(package_root, '..', '..')
const jest_config = path.join(monorepo_root, 'config', 'jest.cjs')

if (argv.ci) {
  await $`NODE_OPTIONS=--experimental-vm-modules npx jest \
  --ci \
  --config ${jest_config} \
  --coverage \
  --coverageDirectory ${path.join(package_root, 'coverage')} \
  --rootDir ${monorepo_root} \
  --selectProjects ${package_name}`
} else {
  if (argv.watch) {
    await $`NODE_OPTIONS=--experimental-vm-modules npx jest \
    --config ${jest_config} \
    --rootDir ${monorepo_root} \
    --selectProjects ${package_name} \
    --watch`
  } else {
    await $`NODE_OPTIONS=--experimental-vm-modules npx jest \
    --config ${jest_config} \
    --rootDir ${monorepo_root} \
    --selectProjects ${package_name}`
  }
}
