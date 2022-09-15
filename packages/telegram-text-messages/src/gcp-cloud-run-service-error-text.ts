import { Emoji } from './constants.js'
import { gcpCloudRunServiceText } from './gcp-cloud-run-service-text.js'
import type { Section } from './interfaces.js'

export interface Config {
  /**
   * GCP region where the Cloud Run service is being executed.
   * Is this available from the environment?
   */
  cloud_run_service_region_id: string

  error: Error

  /**
   * GCP project ID.
   * Is this available from the environment?
   */
  gcp_project_id: string // is this available in the Cloud Run service environment?

  title?: string
}

export interface Options {
  emoji?: string
  should_include_stack_trace?: boolean
}

export const DEFAULT_OPTIONS: Required<Options> = {
  emoji: Emoji.Error,
  should_include_stack_trace: true
}

/**
 * Convenience function for a text message that represents an error occurred in
 * a Cloud Run service environment.
 */
export const gcpCloudRunServiceErrorText = (
  config: Config,
  options: Options = DEFAULT_OPTIONS
) => {
  const { cloud_run_service_region_id, error, gcp_project_id } = config

  const emoji =
    options.emoji !== undefined ? options.emoji : DEFAULT_OPTIONS.emoji

  const should_include_stack_trace =
    options.should_include_stack_trace !== undefined
      ? options.should_include_stack_trace
      : DEFAULT_OPTIONS.should_include_stack_trace

  const sections: Section[] = []

  const err = error as any
  if (err.details && err.details.length > 0) {
    const error_details = err.details as string[]
    sections.push({ title: 'Error details', body: error_details.join('\n') })
  }

  if (should_include_stack_trace && error.stack) {
    sections.push({
      title: 'Stack trace',
      body: `<pre>${error.stack}</pre>`
    })
  }

  const text = gcpCloudRunServiceText({
    cloud_run_service_region_id,
    description: `<pre>${error.message}</pre>`,
    gcp_project_id,
    sections,
    title: config.title ? config.title : `${emoji} ${error.name}`
  })

  return text
}
