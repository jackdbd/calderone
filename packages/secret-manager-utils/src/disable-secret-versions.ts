import makeDebug from 'debug'
import type { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const debug = makeDebug('secret-manager-utils/disable-secret-versions')

export interface Config {
  filter: string
  project_id?: string
  secret_manager: SecretManagerServiceClient
  secret_name: string
}

/**
 * Disable all versions of a secret that match the given string `filter`.
 *
 * See here: https://cloud.google.com/secret-manager/docs/filtering
 */
export const disableSecretVersionsMatchingFilter = async ({
  filter,
  project_id,
  secret_manager,
  secret_name
}: Config) => {
  let prj = project_id
  if (!prj) {
    prj = await secret_manager.getProjectId()
  }

  // TODO: autopaginate? (2nd argument)
  // const options = { autoPaginate:true }
  const [versions] = await secret_manager.listSecretVersions({
    parent: `projects/${prj}/secrets/${secret_name}`,
    pageSize: 50,
    filter
  })

  debug(
    `retrieved ${versions.length} versions of secret ${secret_name} that match the filter "${filter}"`
  )

  const to_disable: string[] = []
  for (const v of versions) {
    if (v.name) {
      to_disable.push(v.name)
    } else {
      debug(`found secret version with no name, cannot disable it: %O`, v)
    }
  }

  const disabled: { name?: string; etag?: string }[] = []
  for (const name of to_disable) {
    const [vers] = await secret_manager.disableSecretVersion({ name })
    debug(`${vers.name} (etag ${vers.etag}) is now ${vers.state}`)
    disabled.push({
      etag: vers.etag || undefined,
      name: vers.name || undefined
    })
  }

  return {
    message: `disabled ${disabled.length} versions of secret ${secret_name}`,
    disabled
  }
}
