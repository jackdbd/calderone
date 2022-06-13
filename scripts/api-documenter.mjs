#!/usr/bin/env zx

import 'zx/globals'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/api-documenter.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const package_root = process.env.PWD
const input_folder = path.join(package_root, '.ae', 'doc')
const output_folder = path.join(package_root, 'api-docs')

await $`api-documenter markdown --input-folder ${input_folder} --output-folder ${output_folder}`
