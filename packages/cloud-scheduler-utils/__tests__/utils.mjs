import fs from 'node:fs'
import path from 'node:path'
import { CloudSchedulerClient } from '@google-cloud/scheduler'
import { isOnGithub } from '@jackdbd/checks/environment'
import { monorepoRoot } from '../../utils/lib/path.js'

export const secret = (env) => {
  let json
  if (isOnGithub(env)) {
    // console.log('=== CODE IS RUNNING ON GITHUB ===')
    json = env.SA_NOTIFIER
  } else {
    // console.log('=== CODE IS RUNNING ON MY LAPTOP ===')
    const json_path = path.join(monorepoRoot(), 'secrets', 'sa-notifier.json')
    json = fs.readFileSync(json_path).toString()
  }
  return JSON.parse(json)
}

export const credentials = (env) => {
  const { client_email, private_key } = secret(env)
  return { client_email, private_key }
}

export const projectId = (env) => {
  return secret(env).project_id
}

/**
 * Create a Cloud Scheduler client using a service account that has IAM
 * permissions to create/delete jobs.
 */
export const cloudSchedulerClient = (env) => {
  const { client_email, private_key, project_id } = secret(env)

  return new CloudSchedulerClient({
    credentials: { client_email, private_key },
    projectId: project_id
  })
}
