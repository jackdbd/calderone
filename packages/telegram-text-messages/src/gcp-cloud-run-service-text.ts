import { genericText } from './generic-text.js'
import type { Section } from './interfaces.js'
import { anchor } from './utils.js'

export interface Config {
  /**
   * GCP region where the Cloud Run service is being executed.
   * Is this available from the environment?
   */
  cloud_run_service_region_id: string

  description: string

  /**
   * GCP project ID.
   * Is this available from the environment?
   */
  gcp_project_id: string // is this available in the Cloud Run service environment?

  sections?: Section[]

  title: string
}

/**
 * Convenience function for text messages generated from a Cloud Run service environment.
 *
 * @see [Environment variables for services - Cloud Run](https://cloud.google.com/run/docs/container-contract#env-vars)
 */
export const gcpCloudRunServiceText = (config: Config) => {
  const { cloud_run_service_region_id, description, gcp_project_id, title } =
    config

  const service_id =
    process.env.K_SERVICE || 'environment variable K_SERVICE not set'

  const revision_id =
    process.env.K_REVISION || 'environment variable K_REVISION not set'

  //   const configuration_id =
  //     process.env.K_CONFIGURATION ||
  //     'environment variable K_CONFIGURATION not set'

  //   const port = process.env.PORT || 'environment variable PORT not set'

  const service_link = {
    text: service_id,
    href: `https://console.cloud.google.com/run/detail/${cloud_run_service_region_id}/${service_id}/logs?project=${gcp_project_id}`
  }

  const sections = config.sections ? config.sections : []

  return genericText({
    title,
    subtitle: [
      `Cloud Run service: ${anchor(service_link)}`,
      `Revision: <code>${revision_id}</code>`
    ].join('\n'),
    description,
    sections
  })
}
