#!/usr/bin/env zx

import { path } from 'zx'
import 'zx/globals'
import { throwIfNotInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from the monorepo root):
// ./scripts/new-package.mjs

throwIfNotInvokedFromMonorepoRoot(process.env.PWD)

const scope = 'jackdbd'

const cg = chalk.green
const cr = chalk.red
const cy = chalk.yellow

const unscoped_name = await question(
  `${cy('Type the')} ${cy.bold('unscoped')} ${cy(
    ` name of your new package (i.e. my-package, ${cy.bold('not')} ${cy(
      `@${scope}/my-package)`
    )} `
  )}`
)

if (unscoped_name === undefined || unscoped_name === '') {
  throw new Error(cr(`Cannot create package. Package name not specified`))
}

const choices = ['app', 'lib']
const package_type = await question(
  `${cy(`What kind of package is @${scope}/${unscoped_name}? Type`)} ${cy.bold(
    'app'
  )} ${cy('for an application,')} ${cy.bold('lib')} ${cy('for a library')} `,
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
    cr(`Cannot create package. You must choose one of: ${choices.join(', ')}`)
  )
}

const basenames = await fs.readdir(source)
const patters = basenames.map((name) => path.join(source, name))

await $`mkdir ${package_root}`
await $`cp -r ${patters} ${package_root}`

await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/package.json`
await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/README.md`

if (package_type === 'app') {
  await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/src/main.ts`

  console.log(
    cg(`Application @${scope}/${unscoped_name} created at ${package_root}`)
  )
} else if (package_type === 'lib') {
  await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/src/index.ts`
  await $`sed -i 's/PACKAGE_NAME/${unscoped_name}/g' ${package_root}/release.config.cjs`

  console.log(
    cg(`Library @${scope}/${unscoped_name} created at ${package_root}`)
  )
  console.log(
    chalk.yellow(`You can build ${unscoped_name} with the following command:`)
  )
  console.log(`npm run build -w packages/${unscoped_name}`)
  console.log(
    chalk.yellow(
      `Add ${unscoped_name} to your Jest config, then run the tests with the following command:`
    )
  )
  console.log(`npm run test -w packages/${unscoped_name}`)
} else {
  throw new Error(`package_type ${package_type} not implemented`)
}
