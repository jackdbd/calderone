#!/usr/bin/env zx

import 'zx/globals'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/api-extractor.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)
const package_root = process.env.PWD
const config = path.join(package_root, 'api-extractor.json')

// https://api-extractor.com/pages/setup/invoking/
// run this on the CI
await $`api-extractor run --config ${config} --verbose`

// maybe run this locally
// await $`api-extractor run --config ${config} --local --verbose`
// this produces a LOT of output
// await $`api-extractor run --config ${config} --diagnostics`
