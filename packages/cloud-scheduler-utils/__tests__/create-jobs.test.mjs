import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import { createHttpJob } from '../lib/create-jobs.js'
import { deleteJob } from '../lib/delete-jobs.js'
import { cloudSchedulerClient, credentials, projectId } from './utils.mjs'

// These tests are slow, so the default timeout (5000 ms) could be not enough.
const TEST_TIMEOUT_MS = 15_000
const BEFORE_EACH_TIMEOUT_MS = 15_000
const AFTER_EACH_TIMEOUT_MS = 15_000

describe('createHttpJob', () => {
  const cloud_scheduler = cloudSchedulerClient(process.env)
  const project_id = projectId(process.env)
  const { client_email } = credentials(process.env)

  // spaces are not possible, apostrophes are not possible (e.g. year's)
  const job_name = 'test-job-at-new-year-eve'
  const job_location_id = 'europe-west3'

  beforeEach(async () => {
    try {
      await deleteJob({
        cloud_scheduler,
        location_id: job_location_id,
        name: job_name
      })
    } catch (err) {
      // nothing to do if there is no such a job
    }
  }, BEFORE_EACH_TIMEOUT_MS)

  afterEach(async () => {
    try {
      await deleteJob({
        cloud_scheduler,
        location_id: job_location_id,
        name: job_name
      })
    } catch (err) {
      throw new Error(
        `Each test should have created a job called '${job_name}': ${err.message}`
      )
    }
  }, AFTER_EACH_TIMEOUT_MS)

  it(
    'creates a job with the expected name, HTTP target uri, timezone, schedule',
    async () => {
      // https://crontab.guru/#59_23_31_12_*
      const schedule = '59 23 31 12 *'
      const timezone = 'Europe/Rome'

      const url_to_call = 'https://www.google.com/'

      const job = await createHttpJob({
        cloud_scheduler,
        description: 'this is a test HTTP job',
        location_id: job_location_id,
        name: job_name,
        project_id,
        schedule,
        service_account_email: client_email,
        timezone,
        url_to_call
      })

      expect(job.name).toBe(
        `projects/${project_id}/locations/${job_location_id}/jobs/${job_name}`
      )
      expect(job.schedule).toBe(schedule)
      expect(job.timeZone).toBe(timezone)
      expect(job.httpTarget.uri).toBe(url_to_call)
    },
    TEST_TIMEOUT_MS
  )
})
