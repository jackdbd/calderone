#!/usr/bin/env zx

import 'zx/globals'

// Usage (from the package root):
// publish to npmjs the latest version that was published to Artifact Registry
// ./scripts/publish/npm.mjs
// publish to npmjs a specific version that was published to Artifact Registry
// ./scripts/publish/npm.mjs --version 1.2.3

const scope = 'jackdbd'

const { name } = require(`${process.env.PWD}/package.json`)
if (name == 'root') {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

const package_root = process.env.PWD
const { stdout: unscoped_name } = await $`basename ${package_root} | tr -d '\n'`

const scoped_name = `@${scope}/${unscoped_name}`

let params = [
  '--location',
  `${process.env.ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION}`,
  '--package',
  `${scoped_name}`,
  '--repository',
  `${process.env.ARTIFACT_REGISTRY_NPM_REPOSITORY_ID}`
]

const monorepo_root = path.join(package_root, '..', '..')

await $`npx google-artifactregistry-auth --repo-config ${monorepo_root}/.npmrc --credential-config ~/.npmrc`

let version = '0.0.0'
if (argv.version) {
  version = argv.version
} else {
  params = [
    ...params,
    '--sort-by',
    '~UPDATE_TIME',
    '--limit',
    1,
    '--format',
    'value(format("{0}",name))'
  ]

  const { stdout: latest_version } =
    await $`gcloud artifacts versions list ${params} | tr -d '\n'`

  version = latest_version
}

// // tr -d '\n' is to remove the newline character
const tmp_dir = await $`mktemp -d -t npm-pkg-XXXXXXXXXX | tr -d '\n'`

// https://docs.npmjs.com/cli/v8/commands/npm-pack
// https://stackoverflow.com/questions/15035786/download-source-from-npm-without-installing-it
await $`npm pack @${scope}/${unscoped_name}@${version} --pack-destination ${tmp_dir}`

await $`cd ${tmp_dir} && tar -xvf "${tmp_dir}/${scope}-${unscoped_name}-${version}.tgz"`
await $`cd ${tmp_dir}/package && rm -rf __tests__ src release.config.cjs tsconfig.*`

const npm_access_token = process.env.NPM_TOKEN
if (npm_access_token === undefined) {
  throw new Error(`environment variable NPM_TOKEN not set. Abort.`)
}
await $`echo //registry.npmjs.org/:_authToken=${npm_access_token} > ${tmp_dir}/package/.npmrc`

console.log(
  chalk.yellow(`You are about to publish ${scoped_name}@${version} to npmjs`)
)
console.log(chalk.yellow(`These are the files you are about to publish`))
await $`tree -L 3 ${tmp_dir}/package`

let confirm_publish = await question(
  chalk.yellow(`Confirm publish to npmjs? (y: yes, n: no) `),
  {
    choices: ['y', 'n']
  }
)

if (confirm_publish === 'y') {
  console.log(chalk.yellow(`Publish ${scoped_name}:${version} to npmjs`))
  await $`cd ${tmp_dir}/package && npm publish . --access public`
  console.log(chalk.green(`Published ${scoped_name}:${version} to npmjs`))
} else {
  console.log(
    chalk.red(
      `Publish aborted. Package ${scoped_name}:${version} not published to npmjs.`
    )
  )
}
