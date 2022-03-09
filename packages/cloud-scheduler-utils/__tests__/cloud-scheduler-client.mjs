import fs from 'node:fs'
import path from 'node:path'
import { env } from 'node:process'
import { CloudSchedulerClient } from '@google-cloud/scheduler'
import { isOnGithub } from '../../checks/lib/environment.js'
import { monorepoRoot } from '../../utils/lib/path.js'

export const secret = (env) => {
  let json
  if (isOnGithub(env)) {
    json = env.SA_NOTIFIER
  } else {
    const json_path = path.join(monorepoRoot(), 'secrets', 'sa-notifier.json')
    json = fs.readFileSync(json_path).toString()
  }
  return JSON.parse(json)
}

export const credentials = () => {
  const { client_email, private_key } = secret(env)
  return { client_email, private_key }
}

export const projectId = () => {
  return secret(env).project_id
}

/**
 * Create a Cloud Scheduler client using a service account that has IAM
 * permissions to create/delete jobs.
 */
export const cloudSchedulerClient = () => {
  const { client_email, private_key, project_id } = secret(env)

  return new CloudSchedulerClient({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}
