import { CloudSchedulerClient } from '@google-cloud/scheduler'

export const secret = (env) => {
  const json = env.SA_NOTIFIER
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
