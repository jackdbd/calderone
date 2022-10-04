#!/usr/bin/env zx

import 'zx/globals'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { jsonSecret, throwIfInvokedFromMonorepoRoot } from './utils.mjs'

// Usage (from a package root):
// ../../scripts/create-test-secret.mjs

throwIfInvokedFromMonorepoRoot(process.env.PWD)

const { client_email, private_key, project_id } = jsonSecret(
  'sa-secret-manager-admin-test'
)

const secret_manager = new SecretManagerServiceClient({
  credentials: { client_email, private_key },
  projectId: project_id
})

const secret_name = 'TEST_SECRET'

try {
  const [secret] = await secret_manager.createSecret({
    parent: `projects/${project_id}`,
    secret: {
      name: secret_name,
      labels: { customer: 'personal' },
      replication: {
        automatic: {}
      }
    },
    secretId: secret_name
  })

  console.log(chalk.yellow(`created secret ${secret.name}`))
} catch (err) {
  console.log(chalk.red(err.message))
}
