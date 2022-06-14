import { createHttpJob } from '../lib/create-jobs.js'
import { deleteJob } from '../lib/delete-jobs.js'
import { cloudSchedulerClient, credentials, projectId } from './utils.mjs'

describe('createHttpJob', () => {
  const cloud_scheduler = cloudSchedulerClient(process.env)
  const project_id = projectId(process.env)
  const { client_email } = credentials(process.env)

  it('creates a job with the expected name, HTTP target uri, timezone, schedule', async () => {
    // spaces are not possible, apostrophes are not possible (e.g. year's)
    const name = 'test-job-at-new-year-eve'
    const location_id = 'europe-west3'
    // https://crontab.guru/#59_23_31_12_*
    const schedule = '59 23 31 12 *'
    const timezone = 'Europe/Rome'

    const url_to_call = 'https://www.google.com/'

    const job = await createHttpJob({
      cloud_scheduler,
      description: 'this is a test HTTP job',
      location_id,
      name,
      project_id,
      schedule,
      service_account_email: client_email,
      timezone,
      url_to_call
    })

    expect(job.name).toBe(
      `projects/${project_id}/locations/${location_id}/jobs/${name}`
    )
    expect(job.schedule).toBe(schedule)
    expect(job.timeZone).toBe(timezone)
    expect(job.httpTarget.uri).toBe(url_to_call)

    await deleteJob({ cloud_scheduler, location_id, name })
  })
})
