#!/usr/bin/env zx

import 'zx/globals'
import { isOnGithub } from '@jackdbd/checks/environment'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/api-extractor.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)
const package_root = process.env.PWD
const config = path.join(package_root, 'api-extractor.json')

if (isOnGithub(process.env)) {
  // run this on the CI
  // https://api-extractor.com/pages/setup/invoking/
  await $`api-extractor run --config ${config} --verbose`
} else {
  await $`api-extractor run --config ${config} --local --verbose`
}

// this produces a LOT of output
// await $`api-extractor run --config ${config} --diagnostics`
