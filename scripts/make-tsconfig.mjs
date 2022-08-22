#!/usr/bin/env zx

import 'zx/globals'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'
import { parse, stringify } from 'comment-json'
import { merge } from '@hapi/hoek'
import { fs } from 'zx'

// Usage (from a package root):
// ../../scripts/make-tsconfig.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const package_root = process.env.PWD
const monorepo_root = path.join(package_root, '..', '..')
const config_root = path.join(monorepo_root, 'config')

// fs, path and chalk are globals from zx/globals

const baseTsConfig = parse(
  fs.readFileSync(path.join(config_root, 'tsconfig.base.json')).toString()
)

const appTsConfig = parse(
  fs.readFileSync(path.join(config_root, 'tsconfig.nodejs-app.json')).toString()
)

merge(appTsConfig, baseTsConfig)

const { exclude: _exclude, extends: _extends, ...rest } = appTsConfig

const {
  paths: _paths,
  typeRoots: _typeRoots,
  ...restCompilerOptions
} = rest.compilerOptions

const source = { ...rest, compilerOptions: restCompilerOptions }

const target = {
  compilerOptions: {
    lib: ['ES2021'],
    outDir: './dist',
    rootDir: './src'
  },
  include: ['./src/**/*.ts'],
  typeRoots: ['node_modules/@types', 'custom-types']
}
merge(target, source)

const filepath = path.join(package_root, 'tsconfig-container.json')
fs.writeFileSync(filepath, stringify(target))
console.log(chalk.yellow(`wrote ${filepath}`))
