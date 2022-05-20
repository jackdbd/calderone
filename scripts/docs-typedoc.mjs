#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/docs.mjs

const { name } = require(`${process.env.PWD}/package.json`)
if (name == 'root') {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')
const library_entrypoint = path.join(package_root, 'src', 'index.ts')

const docs_out = path.join(monorepo_root, 'docs', name)

await $`typedoc ${library_entrypoint} \
--excludeInternal \
--excludePrivate \
--out ${docs_out} \
--theme default`
