#!/usr/bin/env zx

import 'zx/globals'
import { jsonSecret } from '../utils.mjs'

// Usage (from the monorepo root):
// ./scripts/publish/artifact-registry.mjs --package utils

const SCOPE = 'jackdbd'

const NPM_CONFIG = {
  credential: `${process.env.HOME}/.npmrc`,
  repo: './config/repo-config-npmrc-artifact-registry'
}

const pkg = argv.package
if (pkg === undefined) {
  throw new Error('package must be set')
}

const project_id = process.env.GCP_PROJECT_ID
if (project_id === undefined) {
  throw new Error('environment variable `GCP_PROJECT_ID` not set. Abort.')
}

const { repository_id, repository_location_id } =
  jsonSecret('artifact-registry')

if (repository_id === undefined) {
  throw new Error('Artifact Registry `repository_id` not set. Abort.')
}

if (repository_location_id === undefined) {
  throw new Error('Artifact Registry `repository_location_id` not set. Abort.')
}

const ARTIFACT_REGISTRY_INFO = `Artifact Registry repository "${repository_id}" (${repository_location_id})`

let { version } = require(`../../packages/${pkg}/package.json`)

const NPM_PACKAGE_INFO = `@${SCOPE}/${pkg}:${version}`

// tr -d '\n' removes the newline character
const tmp_dir = await $`mktemp -d -t npm-pkg-XXXXXXXXXX | tr -d '\n'`
console.log('\n')

console.log(chalk.yellow(`Build ${NPM_PACKAGE_INFO} and copy it to ${tmp_dir}`))
await $`npm run build -w packages/${pkg}`
await $`cp ./packages/${pkg}/package.json ${tmp_dir}/package.json`
await $`cp ./packages/${pkg}/CHANGELOG.md ${tmp_dir}/CHANGELOG.md`
await $`cp ./packages/${pkg}/README.md ${tmp_dir}/README.md`
await $`cp -r ./packages/${pkg}/lib ${tmp_dir}/lib`

console.log(chalk.yellow(`Retrieve access token for ${ARTIFACT_REGISTRY_INFO}`))
await $`npx google-artifactregistry-auth --repo-config ${NPM_CONFIG.repo} --credential-config ${NPM_CONFIG.credential}`
await $`cp ${NPM_CONFIG.repo} ${tmp_dir}/.npmrc`

console.log(
  chalk.yellow(
    `You are about to publish ${NPM_PACKAGE_INFO} to ${ARTIFACT_REGISTRY_INFO}`
  )
)
await $`tree -L 3 ${tmp_dir}`

let confirm_publish = await question(
  chalk.yellow(`❓ Confirm publish? (y: yes, n: no) `),
  {
    choices: ['y', 'n']
  }
)

if (confirm_publish === 'y') {
  console.log(
    chalk.yellow(`Publish ${NPM_PACKAGE_INFO} to ${ARTIFACT_REGISTRY_INFO}`)
  )
  await $`cd ${tmp_dir} && npm publish .`
  console.log(
    chalk.green(`📣 Published ${NPM_PACKAGE_INFO} to ${ARTIFACT_REGISTRY_INFO}`)
  )
} else {
  console.log(chalk.yellow(`⚠️ Publish to Artifact Registry aborted `))
}
