#!/usr/bin/env zx

import 'zx/globals'

// Usage (from the package root):
// publish to npmjs the latest version that was published to Artifact Registry
// ./scripts/publish/npm.mjs
// publish to npmjs a specific version that was published to Artifact Registry
// ./scripts/publish/npm.mjs --version 1.2.3

const isOnCloudBuild = () => {
  if (process.env.BUILD_ID) {
    return true
  } else {
    return false
  }
}

if (!isOnCloudBuild()) {
  throw new Error(
    chalk.red(
      `It does NOT look this script is being executed on Cloud Build. This script should run exclusively on Cloud Build.`
    )
  )
}

const SCOPE = 'jackdbd'

const NPM_REGISTRY_ON_ARTIFACT_REGISTRY = {
  location: 'europe-west3',
  repository: 'npm-registry'
}

const { name } = require(`${process.env.PWD}/package.json`)
if (name == 'root') {
  throw new Error(
    `you invoked this script from ${process.env.PWD}. This script should be invoked from a package root instead.`
  )
}

const package_root = process.env.PWD
const { stdout: unscoped_name } = await $`basename ${package_root} | tr -d '\n'`

const scoped_name = `@${SCOPE}/${unscoped_name}`

const monorepo_root = path.join(package_root, '..', '..')

const NPM_CONFIG = {
  credential: path.join(process.env.HOME, '.npmrc'),
  repo: path.join(
    monorepo_root,
    'config',
    'repo-config-npmrc-artifact-registry'
  )
}

const ARTIFACT_REGISTRY_INFO = `Artifact Registry repository "${NPM_REGISTRY_ON_ARTIFACT_REGISTRY.repository}" (${NPM_REGISTRY_ON_ARTIFACT_REGISTRY.location})`

let params = [
  '--location',
  `${NPM_REGISTRY_ON_ARTIFACT_REGISTRY.location}`,
  '--package',
  `${scoped_name}`,
  '--repository',
  `${NPM_REGISTRY_ON_ARTIFACT_REGISTRY.repository}`
]

console.log(chalk.yellow(`Retrieve access token for ${ARTIFACT_REGISTRY_INFO}`))
await $`npx google-artifactregistry-auth --repo-config ${NPM_CONFIG.repo} --credential-config ${NPM_CONFIG.credential}`

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

  // TODO: gcloud not available in Cloud Build

  const { stdout: latest_version } =
    await $`gcloud artifacts versions list ${params} | tr -d '\n'`

  version = latest_version
}

// // tr -d '\n' is to remove the newline character
const tmp_dir = await $`mktemp -d -t npm-pkg-XXXXXXXXXX | tr -d '\n'`

const npm_pack_args = [
  `@${SCOPE}/${unscoped_name}:${version}`,
  '--pack-destination',
  `${tmp_dir}`
]

console.log('npm_pack_args', npm_pack_args)

// https://docs.npmjs.com/cli/v8/commands/npm-pack
// https://stackoverflow.com/questions/15035786/download-source-from-npm-without-installing-it
// await $`npm pack @${SCOPE}/${unscoped_name}:${version} --pack-destination ${tmp_dir}`
await $`npm pack ${npm_pack_args.join(' ')}`

await $`cd ${tmp_dir} && tar -xvf "${tmp_dir}/${SCOPE}-${unscoped_name}-${version}.tgz"`
await $`cd ${tmp_dir}/package && rm -rf __tests__ src release.config.cjs tsconfig.*`

const npm_access_token_before = process.env.NPM_TOKEN
console.log('🚀 ~ npm_access_token_before', npm_access_token_before)
const npm_access_token = JSON.parse(process.env.NPM_ACCESS_TOKENS).default
if (npm_access_token === undefined) {
  throw new Error(chalk.red(`npm access token not set. Abort.`))
}
await $`echo //registry.npmjs.org/:_authToken=${npm_access_token} > ${tmp_dir}/package/.npmrc`

console.log(
  chalk.yellow(`You are about to publish ${scoped_name}@${version} to npmjs`)
)
console.log(chalk.yellow(`These are the files you are about to publish`))
await $`tree -L 3 ${tmp_dir}/package`

// Cloud Build manual confirmation? How to do it?
// https://cloud.google.com/build/docs/automating-builds/approve-builds

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
