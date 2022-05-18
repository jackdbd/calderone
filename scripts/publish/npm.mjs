#!/usr/bin/env zx

import { addAbortSignal } from 'stream'
import 'zx/globals'

// Usage:
// ./scripts/publish/npm.mjs --package utils --version 1.2.3

const scope = 'jackdbd'

const pkg = argv.package
if (pkg === undefined) {
  throw new Error('package must be set')
}

const version = argv.version
if (version === undefined) {
  throw new Error('version must be set')
}

// $`npx google-artifactregistry-auth --repo-config .npmrc --credential-config ~/.npmrc`

const { stdout: vers } = await $`npm view @${scope}/${pkg}@${version} version`

if (vers) {
  console.log(
    chalk.green(
      `Package @${scope}/${pkg}:${version} was published to Artifact Registry.`
    )
  )
} else {
  throw new Error(
    `Package @${scope}/${pkg}:${version} was NOT published to Artifact Registry. Abort.`
  )
}

// tr -d '\n' is to remove the newline character
const tmp_dir = await $`mktemp -d -t npm-pkg-XXXXXXXXXX | tr -d '\n'`

// https://docs.npmjs.com/cli/v8/commands/npm-pack
// https://stackoverflow.com/questions/15035786/download-source-from-npm-without-installing-it
await $`npm pack @${scope}/${pkg}@${version} --pack-destination ${tmp_dir}`

await $`cd ${tmp_dir} && tar -xvf "${tmp_dir}/${scope}-${pkg}-${version}.tgz"`

// await $`cp config/npmignore-lib ${tmp_dir}/package/.npmignore`
await $`cd ${tmp_dir}/package && rm -rf __tests__ src release.config.cjs tsconfig.*`

const npm_access_token = process.env.NPM_TOKEN
if (npm_access_token === undefined) {
  throw new Error(`environment variable NPM_TOKEN not set. Abort.`)
}
await $`echo //registry.npmjs.org/:_authToken=${npm_access_token} > ${tmp_dir}/package/.npmrc`

console.log(
  chalk.yellow(`You are about to publish @${scope}/${pkg}@${version} to npmjs`)
)
await $`tree -L 3 ${tmp_dir}/package`

let should_publish_to_npm = await question(
  chalk.yellow(`Confirm publish to npmjs? (y: yes, n: no) `),
  {
    choices: ['y', 'n']
  }
)

if (should_publish_to_npm === 'y') {
  console.log(chalk.yellow(`Publish @${scope}/${pkg}:${version} to npmjs`))
  await $`cd ${tmp_dir}/package && npm publish . --access public`
  console.log(chalk.green(`Published @${scope}/${pkg}:${version} to npmjs`))
} else {
  console.log(chalk.yellow(`Publish to npmjs aborted `))
}
