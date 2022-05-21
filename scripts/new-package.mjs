#!/usr/bin/env zx

import path from 'path'
import 'zx/globals'

// Usage (from the monorepo root):
// ./scripts/new-package.mjs

const scope = 'jackdbd'

const unscoped_name = await question(
  chalk.yellow(
    `Type an unscoped name for your package (i.e. my-package instead of @${scope}/my-package) `
  )
)

if (unscoped_name === undefined || unscoped_name === '') {
  throw new Error('Cannot create package. Package name not specified')
}

const choices = ['app', 'lib']
const package_type = await question(
  chalk.yellow(
    `Is @${scope}/${unscoped_name} a library or an application? (lib: library, app: application) `
  ),
  {
    choices
  }
)

const monorepo_root = process.env.PWD
const package_root = path.join(monorepo_root, 'packages', unscoped_name)

let source = ''
if (package_type === 'app') {
  source = path.join(monorepo_root, 'assets', 'templates', 'application')
} else if (package_type === 'lib') {
  source = path.join(monorepo_root, 'assets', 'templates', 'library')
} else {
  throw new Error(
    `Cannot create package. You must choose one of: ${choices.join(', ')}`
  )
}

const basenames = await fs.readdir(source)
const patters = basenames.map((name) => path.join(source, name))

await $`mkdir ${package_root}`
await $`cp -r ${patters} ${package_root}`

await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/package.json`
await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/README.md`

await $`npm run build -w packages/${unscoped_name}`

if (package_type === 'app') {
  await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/src/main.ts`
  await $`npm run start:development -w packages/${unscoped_name}`
} else if (choices === 'lib') {
  await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/src/index.ts`
  await $`node ${package_root}/lib/index.js`
}
