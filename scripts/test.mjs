#!/usr/bin/env zx

import 'zx/globals'
import { spawn } from 'node:child_process'

// Usage (from a package root):
// ../../scripts/test.mjs

const { name } = require(`${process.env.PWD}/package.json`)
if (name == 'root') {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

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

// the command $`npx jest <PARAMS>` would execute jest in a child process but
// would not preserve color output. By explicitly inheriting stdio we can
// preserve the color output (jest will still be executed in a child process).
// https://stackoverflow.com/questions/7725809/preserve-color-when-executing-child-process-spawn
spawn(jest, params, { stdio: 'inherit' })
