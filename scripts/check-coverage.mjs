#!/usr/bin/env zx

import { fs } from 'zx'
import 'zx/globals'
import { throwIfNotInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from the monorepo root):
// ./scripts/check-coverage.mjs

// Probably I don't need to use this script, because Codecov should support
// multiple coverage report for monorepos. But I am not sure how to tag the
// individual packages of this monorepo before uploading their coverage report
// to Codecov.

// https://docs.codecov.com/docs/codecov-uploader
// https://github.com/marketplace/actions/codecov

throwIfNotInvokedFromMonorepoRoot(process.env.PWD)

const monorepo_root = process.env.PWD

const { stdout } = await $`ls -d ${path.join(monorepo_root, 'packages')}/*`

// trim() is for stripping out the last newline from stdout
for (const [i, package_root] of Object.entries(stdout.trim().split('\n'))) {
  const package_name = path.basename(package_root)

  // maybe use these as tags for the coverage report?
  //   const flag = package_name
  //   const name = package_name

  const coverage_dir = path.join(package_root, 'coverage', 'lcov-report')
  const coverage_file = path.join(package_root, 'coverage', 'lcov.info')

  if (fs.existsSync(coverage_dir) && fs.existsSync(coverage_file)) {
    console.log(chalk.green(`package ${package_name} has a coverage report`))
  } else {
    console.log(chalk.yellow(`package ${package_name} has no coverage report`))
  }
}
