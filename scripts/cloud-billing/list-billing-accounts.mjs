import { readFile } from 'node:fs/promises'
import path from 'node:path'
// import { env } from 'node:process'
import { monorepoRoot } from '@jackdbd/utils/path'
import { CloudBillingClient } from '@google-cloud/billing'

const listBillingAccounts = async () => {
  const json_key_path = path.join(monorepoRoot(), 'secrets', 'sa-notifier.json')
  const json_string = (await readFile(json_key_path)).toString()
  const obj = JSON.parse(json_string)
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

const main = async () => {
  await listBillingAccounts()
}

main()
