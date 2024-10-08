#!/usr/bin/env zx

import 'zx/globals'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/delete-test-secret.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const json = process.env.SA_SECRET_MANAGER_ADMIN_TEST
const { client_email, private_key, project_id } = JSON.parse(json)

const secret_manager = new SecretManagerServiceClient({
  credentials: { client_email, private_key },
  projectId: project_id
})

const secret_name = 'TEST_SECRET'
const name = `projects/${project_id}/secrets/${secret_name}`

await secret_manager.deleteSecret({ name })

console.log(
  chalk.yellow(`deleted secret ${secret_name} in GCP project ${project_id}`)
)
