#!/usr/bin/env zx

import 'zx/globals'
import {
  throwIfInvokedFromMonorepoRoot,
  unscopedPackageName
} from './utils.mjs'

// Usage (from a package root):
// ../../scripts/typedoc.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const unscoped_name = await unscopedPackageName(process.env.PWD)

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')
const library_entrypoint = path.join(package_root, 'src', 'index.ts')
const docs_out = path.join(monorepo_root, 'docs', unscoped_name)

await $`typedoc ${library_entrypoint} \
--excludeInternal \
--excludePrivate \
--out ${docs_out} \
--theme default`
