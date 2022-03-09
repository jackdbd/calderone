import fs from 'fs'
import path from 'path'
import { env } from 'process'
import { monorepoRoot } from '../lib/utils.js'
import { tokensClient } from '../lib/tokens/basic-client.js'
import { contactsClient } from '../lib/contacts/basic-client.js'

const main = async () => {
  const filepath = path.join(monorepoRoot(), 'secrets', 'keap.json')

  const tokens = JSON.parse(fs.readFileSync(filepath).toString())

  const tokens_client = tokensClient({
    client_id: env.KEAP_OAUTH_CLIENT_ID,
    client_secret: env.KEAP_OAUTH_CLIENT_SECRET,
    refresh_token: tokens.refresh_token
  })

  const refreshed_tokens = await tokens_client.tokens()

  fs.writeFileSync(filepath, JSON.stringify(refreshed_tokens, null, 2))

  const contacts_client = contactsClient({
    access_token: refreshed_tokens.access_token
  })

  const paginated = await contacts_client.retrieve({
    pagination: { limit: 2 }
  })

  console.log(`retrieved ${paginated.data.length}/${paginated.count} contacts`)
  console.log(`contacts`, paginated.data)
  console.log(`next`, paginated.next)
}

main()
