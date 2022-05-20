#!/usr/bin/env zx

import 'zx/globals'

// Usage (from a package root):
// ../../scripts/docs.mjs

const { stdout: s1 } =
  await $`cat package.json | jq .name | sed s'/@jackdbd\\///' | sed s'/"//g'`

const { stdout: s2 } = await $`basename ${process.env.PWD}`

if (s1 !== s2) {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

// tr -d '\n' is to remove the newline character
const { stdout: library_name } = await $`echo ${s1} | tr -d '\n'`

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')
const library_entrypoint = path.join(package_root, 'src', 'index.ts')

const docs_out = path.join(monorepo_root, 'docs', library_name)

await $`typedoc ${library_entrypoint} \
--excludeInternal \
--excludePrivate \
--out ${docs_out} \
--theme default`
