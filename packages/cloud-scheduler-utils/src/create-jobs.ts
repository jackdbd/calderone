import makeDebug from 'debug'
import type { CloudSchedulerClient } from '@google-cloud/scheduler'
import type { protos } from '@google-cloud/scheduler'

const debug = makeDebug('cloud-scheduler-utils/create-jobs')

interface HttpJobConfig {
  cloud_scheduler: CloudSchedulerClient
  description: string
  location_id: string
  name: string
  project_id: string
  req_body?: { [key: string]: any }
  schedule: string
  service_account_email?: string
  timezone: 'Europe/Rome'
  url_to_call: string
}

export const createHttpJob = async ({
  cloud_scheduler,
  description,
  location_id,
  name,
  project_id,
  req_body,
  schedule,
  service_account_email,
  timezone,
  url_to_call
}: HttpJobConfig) => {
  const job_name = `projects/${project_id}/locations/${location_id}/jobs/${name}`
  debug(`create job ${job_name}`)

  const attemptDeadline = { seconds: '1799', nanos: 0 }

  const retryConfig: protos.google.cloud.scheduler.v1.IRetryConfig = {
    retryCount: 0,
    maxRetryDuration: { seconds: '0', nanos: 0 },
    minBackoffDuration: { seconds: '5', nanos: 0 },
    maxBackoffDuration: { seconds: '3600', nanos: 0 },
    maxDoublings: 5
  }

  const oidcToken = service_account_email
    ? ({
        audience: url_to_call,
        serviceAccountEmail: service_account_email
      } as protos.google.cloud.scheduler.v1.IOidcToken)
    : undefined

  const httpTarget: protos.google.cloud.scheduler.v1.IHttpTarget = {
    body: req_body ? Buffer.from(JSON.stringify(req_body)) : undefined,
    headers: { 'content-type': 'application/json' },
    httpMethod: 'POST' as const,
    oidcToken,
    uri: url_to_call
  }

  const job: protos.google.cloud.scheduler.v1.IJob = {
    attemptDeadline,
    description,
    httpTarget,
    name: job_name,
    retryConfig,
    schedule,
    timeZone: timezone
  }

  const parent = cloud_scheduler.locationPath(project_id, location_id)

  const [response] = await cloud_scheduler.createJob({ job, parent })
  return response
}
