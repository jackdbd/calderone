#!/usr/bin/env zx

import 'zx/globals'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/format.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')
const config = path.join(monorepo_root, 'config', 'prettier.cjs')
const glob_pattern = `${package_root}/{__tests__,src}/**/*.{cjs,js,mjs,ts}`

await $`prettier --config ${config} --write ${glob_pattern}`
