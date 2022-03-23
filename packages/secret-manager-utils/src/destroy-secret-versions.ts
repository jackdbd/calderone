import makeDebug from 'debug'
import type { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const debug = makeDebug('secret-manager-utils/destroy-secret-versions')

export interface Config {
  filter: string
  project_id?: string
  secret_manager: SecretManagerServiceClient
  secret_name: string
}

/**
 * Destroy all versions of a secret that match the given string `filter`.
 *
 * See here: https://cloud.google.com/secret-manager/docs/filtering
 */
export const destroySecretVersionsMatchingFilter = async ({
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

  const to_destroy: string[] = []
  for (const v of versions) {
    if (v.name) {
      to_destroy.push(v.name)
    } else {
      debug(`found secret version with no name, cannot destroy it: %O`, v)
    }
  }

  const destroyed: { name?: string; etag?: string }[] = []
  for (const name of to_destroy) {
    const [vers] = await secret_manager.destroySecretVersion({ name })
    debug(`${vers.name} (etag ${vers.etag}) is now ${vers.state}`)
    destroyed.push({
      etag: vers.etag || undefined,
      name: vers.name || undefined
    })
  }

  return {
    message: `destroyed ${destroyed.length} versions of secret ${secret_name}`,
    destroyed
  }
}
