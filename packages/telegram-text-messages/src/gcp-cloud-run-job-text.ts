import { genericText } from './generic-text.js'
import type { Section } from './interfaces.js'
import { anchor } from './utils.js'

export interface Config {
  /**
   * GCP region where the Cloud Run Job is being executed.
   * Is this available from the environment?
   */
  cloud_run_job_region_id: string

  description: string

  /**
   * GCP project ID.
   * Is this available from the environment?
   */
  gcp_project_id: string // is this available in the Cloud Run Jobs environment?

  sections?: Section[]

  title: string
}

export interface Options {
  should_include_task_section?: boolean
}

export const DEFAULT_OPTIONS: Required<Options> = {
  should_include_task_section: true
}

/**
 * Convenience function for text messages generated from a Cloud Run Job environment.
 *
 * @see [Environment variables for jobs - Cloud Run](https://cloud.google.com/run/docs/container-contract#jobs-env-vars)
 */
export const gcpCloudRunJobText = (
  config: Config,
  options: Options = DEFAULT_OPTIONS
) => {
  const { cloud_run_job_region_id, description, gcp_project_id, title } = config

  const cloud_run_job_id =
    process.env.CLOUD_RUN_JOB || 'environment variable CLOUD_RUN_JOB not set'

  const cloud_run_execution_id =
    process.env.CLOUD_RUN_EXECUTION ||
    'environment variable CLOUD_RUN_EXECUTION not set'

  const cloud_run_task_attempt =
    process.env.CLOUD_RUN_TASK_ATTEMPT ||
    'environment variable CLOUD_RUN_TASK_ATTEMPT not set'

  const cloud_run_task_count =
    process.env.CLOUD_RUN_TASK_COUNT ||
    'environment variable CLOUD_RUN_TASK_COUNT not set'

  const cloud_run_task_index =
    process.env.CLOUD_RUN_TASK_INDEX ||
    'environment variable CLOUD_RUN_TASK_INDEX not set'

  const should_include_task_section =
    options.should_include_task_section !== undefined
      ? options.should_include_task_section
      : DEFAULT_OPTIONS.should_include_task_section

  const cloud_run_job_link = {
    text: cloud_run_job_id,
    href: `https://console.cloud.google.com/run/jobs/details/${cloud_run_job_region_id}/${cloud_run_job_id}/executions?project=${gcp_project_id}`
  }

  // const cloud_run_job_logs_link = {
  //   text: `Logs`,
  //   href: `https://console.cloud.google.com/run/jobs/details/${cloud_run_job_region_id}/${cloud_run_job_id}/logs?project=${gcp_project_id}`
  // }

  //   const cloud_run_execution_link = {
  //     text: `Execution <code>${cloud_run_execution_id}</code>`,
  //     href: `https://console.cloud.google.com/run/jobs/executions/details/${cloud_run_job_region_id}/${cloud_run_execution_id}/tasks?project=${gcp_project_id}`
  //   }

  const sections = config.sections ? config.sections : []

  if (should_include_task_section) {
    sections.push({
      title: `Task details`,
      body: [
        `index: ${cloud_run_task_index}`,
        `attempt: ${cloud_run_task_attempt}`,
        `count: ${cloud_run_task_count}`
      ].join('\n')
    })
  }

  return genericText({
    title,
    subtitle: [
      `Cloud Run Job: ${anchor(cloud_run_job_link)}`,
      `Execution: <code>${cloud_run_execution_id}</code>`
    ].join('\n'),
    description,
    sections
  })
}
