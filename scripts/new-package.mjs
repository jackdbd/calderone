#!/usr/bin/env zx

import 'zx/globals'

// Usage (from the monorepo root):
// ./scripts/new-package.mjs --name my-new-package

const name = argv.name
if (name === undefined) {
  throw new Error('name must be set')
}

const monorepo_root = process.env.PWD
const pkg_root = path.join(monorepo_root, 'packages', name)
const templates = path.join(monorepo_root, 'assets', 'templates')

await $`mkdir -p ${pkg_root}/src`
await $`cp ${templates}/README.md ${pkg_root}/README.md`
await $`cp ${templates}/package.json ${pkg_root}/package.json`
await $`cp ${templates}/tsconfig.json ${pkg_root}/tsconfig.json`
await $`echo "export {}\nconsole.log('hello')\n" > ${pkg_root}/src/index.ts`

await $`sed -i 's/PACKAGE_NAME/${name}/g' ${pkg_root}/README.md`
await $`sed -i 's/PACKAGE_NAME/${name}/g' ${pkg_root}/package.json`

await $`npm run build -w packages/${name}`
await $`node ${pkg_root}/lib/index.js`
