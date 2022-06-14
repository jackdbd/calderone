#!/usr/bin/env zx

import 'zx/globals'
import { jsonSecret, throwIfNotInvokedFromMonorepoRoot } from '../utils.mjs'

throwIfNotInvokedFromMonorepoRoot(process.env.PWD)

const SCOPE = 'jackdbd'
const NODE_VERSION = '16.15.1'
const NPM_PACKAGES_UNSCOPED = [
  'checks',
  'cloud-scheduler-utils',
  'firestore-utils',
  'notifications',
  'secret-manager-utils',
  'utils',
  'telegram-text-messages'
]
const NPM_PACKAGES_SCOPED = NPM_PACKAGES_UNSCOPED.map((s) => `@${SCOPE}/${s}`)
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID

const pwd = process.env.PWD

if (pwd !== '/home/jack/repos/calderone') {
  throw new Error(
    chalk.red(`This script must be launched from the monorepo root`)
  )
}

const { repository_id, repository_location_id } =
  jsonSecret('artifact-registry')

const { chat_id: telegram_chat_id, token: telegram_token } =
  jsonSecret('telegram')

const artifact_registry = `Artifact Registry "${repository_id}" (${repository_location_id})`

console.log(
  chalk.yellow(
    `⚠️ Packages published to ${artifact_registry} that will be republished to npmjs:\n${NPM_PACKAGES_SCOPED.join(
      '\n'
    )}`
  )
)

for (const unscoped_name of NPM_PACKAGES_UNSCOPED) {
  const scoped_name = `@${SCOPE}/${unscoped_name}`

  const substitutions = [
    `_NODE_VERSION=${NODE_VERSION}`,
    `_NPM_PACKAGE_NAME=${unscoped_name}`,
    `_TELEGRAM_CHAT_ID=${telegram_chat_id}`,
    `_TELEGRAM_TOKEN=${telegram_token}`
  ].join(',')

  const confirm_publish = await question(
    chalk.yellow(
      `\n❓Confirm publish ${scoped_name} to npmjs? (y: yes, n: no) `
    ),
    {
      choices: ['y', 'n']
    }
  )

  if (confirm_publish === 'y') {
    const { stdout: build_id } =
      await $`gcloud builds submit cloud-build --async --config=./cloud-build/publish-to-npmjs.yaml --substitutions=${substitutions} --format="value(format("{0}",id))"`
    const build_url = `https://console.cloud.google.com/cloud-build/builds;region=global/${build_id}?project=${GCP_PROJECT_ID}`
    console.log(chalk.blue(`Build logs on Cloud Build: ${build_url}`))
  } else {
    console.log(
      chalk.yellow(`Publish aborted. ${scoped_name} not published to npmjs.`)
    )
  }
}
