import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { monorepoRoot } from '@jackdbd/utils/path'
import { destroySecretVersionsMatchingFilter } from '@jackdbd/secret-manager-utils/destroy-secret-versions'

interface Argv {
  'service-account': string
  secret: string
  verbose: boolean
}

const DEFAULT: Argv = {
  'service-account': 'sa-secret-manager-admin-test.json',
  secret: '',
  verbose: false
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['verbose'])
    .default(DEFAULT).argv as Argv

  if (!argv['secret']) {
    throw new Error('--secret not set')
  }

  const service_account = argv['service-account']

  const json_key_path = path.join(monorepoRoot(), 'secrets', service_account)
  const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  const { project_id, client_email, private_key } = obj

  const secret_manager = new SecretManagerServiceClient({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  const { destroyed, message } = await destroySecretVersionsMatchingFilter({
    filter: 'state:ENABLED OR state:DISABLED',
    secret_manager: secret_manager as any,
    secret_name: argv.secret
  })

  console.log(message)

  if (argv.verbose) {
    console.log(destroyed)
  }
}

main()
