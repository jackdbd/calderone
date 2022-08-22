import fs from 'node:fs'
import path from 'node:path'
import yargs from 'yargs'
import { CloudBillingClient } from '@google-cloud/billing'
import { monorepoRoot } from '@jackdbd/utils/path'

interface Argv {
  'service-account': string
}

const DEFAULT: Argv = {
  'service-account': 'sa-monitoring.json'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2)).default(DEFAULT).argv as Argv

  const service_account = argv['service-account']

  const json_key_path = path.join(monorepoRoot(), 'secrets', service_account)
  const obj = JSON.parse(fs.readFileSync(json_key_path).toString())
  const { project_id, client_email, private_key } = obj

  const client = new CloudBillingClient({
    projectId: project_id,
    credentials: { client_email, private_key }
  })

  const [accounts] = await client.listBillingAccounts()

  console.info(`found ${accounts.length} billing accounts:`)
  for (const account of accounts) {
    console.info(`${account.displayName}:`)
    console.info(`\topen: ${account.open}`)
    console.info(`\tparentBillingAccount: ${account.masterBillingAccount}`)
  }
}

main()
