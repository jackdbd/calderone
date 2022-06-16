import makeDebug from 'debug'
import type { CloudSchedulerClient } from '@google-cloud/scheduler'

const debug = makeDebug('cloud-scheduler-utils/delete-jobs')

interface Config {
  cloud_scheduler: CloudSchedulerClient
  location_id: string
  project_id?: string
}

export const deleteAllJobs = async ({
  cloud_scheduler,
  location_id,
  project_id
}: Config) => {
  let prj_id = project_id
  if (!prj_id) {
    prj_id = await cloud_scheduler.getProjectId()
  }

  const parent = cloud_scheduler.locationPath(prj_id, location_id)
  const [jobs] = await cloud_scheduler.listJobs({ parent })

  await Promise.all(
    jobs.map((job) => {
      debug(`delete job ${job.name}`)
      return cloud_scheduler.deleteJob({ name: job.name })
    })
  )
  debug(`deleted ${jobs.length} jobs`)
}

interface DeleteJobConfig {
  cloud_scheduler: CloudSchedulerClient
  location_id: string
  name: string
  project_id?: string
}

export const deleteJob = async ({
  cloud_scheduler,
  location_id,
  name,
  project_id
}: DeleteJobConfig) => {
  let prj_id = project_id
  if (!prj_id) {
    prj_id = await cloud_scheduler.getProjectId()
  }

  const parent = cloud_scheduler.locationPath(prj_id, location_id)

  const [_res] = await cloud_scheduler.deleteJob({
    name: `${parent}/jobs/${name}`
  })

  debug(`deleted job ${name}`)
}
