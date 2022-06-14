#!/usr/bin/env zx

import 'zx/globals'
import { spawn } from 'node:child_process'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/test.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const package_root = process.env.PWD
// tr -d '\n' is to remove the newline character
const { stdout: package_name } = await $`basename ${package_root} | tr -d '\n'`
const monorepo_root = path.join(package_root, '..', '..')
const jest_config = path.join(monorepo_root, 'config', 'jest.cjs')

// https://jestjs.io/docs/ecmascript-modules
process.env.NODE_OPTIONS = '--experimental-vm-modules'

const { stdout: jest } = await $`which jest | tr -d '\n'`

let params = [
  '--config',
  `${jest_config}`,
  '--rootDir',
  `${monorepo_root}`,
  '--selectProjects',
  `${package_name}`
]

if (argv.ci) {
  params = [
    ...params,
    '--ci',
    '--coverage',
    '--coverageDirectory',
    `${path.join(package_root, 'coverage')}`
  ]
}

if (argv.watch) {
  params.push('--watch')
}

// The command $`npx jest <PARAMS>` executes jest in a child process but does
// NOT preserve any color output. By explicitly inheriting stdio we can preserve
// the color output (jest will still be executed in a child process).
// https://stackoverflow.com/questions/7725809/preserve-color-when-executing-child-process-spawn
// However, it seems that on the GitHub CI the combination spawn + stdout inherit
// causes all tests to pass, while the $`npx jest <PARAMS>` works fine.
// Since on the GitHub CI we don't have color output anyway, we use npx jest
// there, and use the combination spawn + stdout inherit when launching tests
// locally.
if (process.env.GITHUB_SHA) {
  await $`npx jest ${params}`
} else {
  spawn(jest, params, { stdio: 'inherit' })
}
