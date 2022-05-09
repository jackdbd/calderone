import fs from 'fs'
import path from 'path'
import { env } from 'process'
import makeDebug from 'debug'
import yargs from 'yargs'
import { CloudSchedulerClient } from '@google-cloud/scheduler'
import { monorepoRoot } from '@jackdbd/utils/path'

const debug = makeDebug('scripts/cloud-scheduler/example')

const DEFAULT = {
  'delete-job': false,
  description: 'Description of the test job',
  name: 'some-test-job',
  schedule: '45 12 * * *',
  tz: 'Europe/Rome'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['delete-job'])
    .default(DEFAULT).argv

  const json_key_path = path.join(
    monorepoRoot(),
    'secrets',
    'sa-workflows-runner.json'
  )

  const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  const { project_id, client_email, private_key } = obj
  const credentials = { client_email, private_key }

  const scheduler = new CloudSchedulerClient({
    projectId: project_id,
    credentials
  })

  const job_name = argv.name
  const description = argv.description
  const location_id = 'europe-west3'
  const timeZone = argv.tz
  const schedule = argv.schedule

  const parent = scheduler.locationPath(project_id, location_id)

  const job_path = `${parent}/jobs/${job_name}`

  const httpTarget = {
    // body: Buffer.from(JSON.stringify(req_body)),
    body: undefined,
    headers: {
      'content-type': 'application/json',
      'User-Agent': 'Google-Cloud-Scheduler'
    },
    // eslint-disable-next-line @typescript-eslint/prefer-as-const
    httpMethod: 'POST' as 'POST',
    oauthToken: { serviceAccountEmail: env.SA_WORKFLOWS_RUNNER! },
    // oidcToken,
    uri: env.WORKFLOW_URL_RANDOM_COCKTAIL!
  }

  const http_job = {
    attemptDeadline: { seconds: 60 },
    description,
    httpTarget,
    name: job_path,
    // retryConfig,
    schedule,
    timeZone
  }

  if (argv['delete-job']) {
    try {
      await scheduler.deleteJob({ name: job_path })
      debug(`deleted job ${job_name}`)
    } catch (err: any) {
      debug(`could not delete job ${job_name}: ${err.message}`)
    }
  }

  try {
    const [job] = await scheduler.createJob({ job: http_job, parent })
    debug(
      `created job ${job_name} (schedule ${job.schedule}, timezone ${job.timeZone}, attempt deadline in seconds ${job.attemptDeadline?.seconds})`
    )
  } catch (err: any) {
    debug(`could not create job ${job_name}: ${err.message}`)
    return
  }

  try {
    const [job] = await scheduler.runJob({ name: job_path })

    const seconds_updated = parseInt(job.userUpdateTime?.seconds as string)
    const date_updated = new Date(seconds_updated * 1000)
    date_updated.toLocaleString('it-IT', { timeZone })

    const seconds_scheduled = parseInt(job.scheduleTime?.seconds as string)
    const date_scheduled = new Date(seconds_scheduled * 1000)
    date_scheduled.toLocaleString('it-IT', { timeZone })

    debug(
      `run job ${job_name} (updated on ${date_updated}, next scheduled to run on ${date_scheduled})`
    )
  } catch (err: any) {
    debug(`could not run job ${job_name}: ${err.message}`)
  }

  if (argv['delete-job']) {
    try {
      await scheduler.deleteJob({ name: job_path })
      debug(`deleted job ${job_name}`)
    } catch (err: any) {
      debug(`could not delete job ${job_name}: ${err.message}`)
    }
  }
}

main()
