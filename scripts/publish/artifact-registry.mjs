#!/usr/bin/env zx

import 'zx/globals'

// Usage (from the monorepo root):
// ./scripts/publish/artifact-registry.mjs --package utils

const scope = 'jackdbd'

const pkg = argv.package
if (pkg === undefined) {
  throw new Error('package must be set')
}

const project_id = process.env.GCP_PROJECT_ID
if (project_id === undefined) {
  throw new Error(`environment variable GCP_PROJECT_ID not set. Abort.`)
}

const repo_id = process.env.ARTIFACT_REGISTRY_NPM_REPOSITORY_ID
if (project_id === undefined) {
  throw new Error(
    `environment variable ARTIFACT_REGISTRY_NPM_REPOSITORY_ID not set. Abort.`
  )
}

const location_id = process.env.ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION
if (location_id === undefined) {
  throw new Error(
    `environment variable ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION not set. Abort.`
  )
}

let { version } = require(`../../packages/${pkg}/package.json`)

// tr -d '\n' is to remove the newline character
const tmp_dir = await $`mktemp -d -t npm-pkg-XXXXXXXXXX | tr -d '\n'`
console.log('\n')

console.log(
  chalk.yellow(`Build @${scope}/${pkg}:${version} and copy it to ${tmp_dir}`)
)
await $`npm run build -w packages/${pkg}`
await $`cp ./packages/${pkg}/package.json ${tmp_dir}/package.json`
await $`cp ./packages/${pkg}/CHANGELOG.md ${tmp_dir}/CHANGELOG.md`
await $`cp ./packages/${pkg}/README.md ${tmp_dir}/README.md`
await $`cp -r ./packages/${pkg}/lib ${tmp_dir}/lib`

await $`npx google-artifactregistry-auth --repo-config ./config/repo-config-npmrc-artifact-registry --credential-config ~/.npmrc`
await $`cp .npmrc ${tmp_dir}/.npmrc`

console.log(
  chalk.yellow(
    `You are about to publish @${scope}/${pkg}@${version} to Artifact Registry`
  )
)
await $`tree -L 3 ${tmp_dir}`

let confirm_publish = await question(
  chalk.yellow(`Confirm publish to Artifact Registry? (y: yes, n: no) `),
  {
    choices: ['y', 'n']
  }
)

if (confirm_publish === 'y') {
  console.log(
    chalk.yellow(`Publish @${scope}/${pkg}:${version} to Artifact Registry`)
  )
  await $`cd ${tmp_dir} && npm publish .`
  console.log(
    chalk.green(`Published @${scope}/${pkg}:${version} to Artifact Registry`)
  )
} else {
  console.log(chalk.yellow(`Publish to Artifact Registry aborted `))
}
