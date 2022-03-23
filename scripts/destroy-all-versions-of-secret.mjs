import yargs from 'yargs'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { destroySecretVersionsMatchingFilter } from '../packages/secret-manager-utils/lib/destroy-secret-versions.js'

const DEFAULT = {
  secret: '',
  verbose: false
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['verbose'])
    .default(DEFAULT).argv

  if (!argv['secret']) {
    console.error('--secret not set')
    return
  }

  const secret_manager = new SecretManagerServiceClient()

  const { destroyed, message } = await destroySecretVersionsMatchingFilter({
    filter: 'state:ENABLED OR state:DISABLED',
    secret_manager,
    secret_name: argv.secret
  })

  console.log(message)

  if (argv.verbose) {
    console.log(destroyed)
  }
}

main()
