import path from 'path'
import { env } from 'process'
import { monorepoRoot } from '../lib/utils.js'
import { fsStore } from '../lib/tokens-stores/fs.js'
import { storeKeapClient } from '../lib/clients.js'

const toSummary = ({
  date_created,
  email_addresses,
  given_name,
  last_updated,
  social_accounts,
  website
}) => {
  return {
    created: date_created,
    emails: email_addresses.map((d) => d.email).join(','),
    name: given_name,
    socials: social_accounts.join(','),
    updated: last_updated,
    website: website || undefined
  }
}

const main = async () => {
  const filepath = path.join(monorepoRoot(), 'secrets', 'keap.json')
  const store = fsStore(filepath)
  const tokens = await store.retrieve()

  const keap = storeKeapClient({
    client_id: env.KEAP_OAUTH_CLIENT_ID,
    client_secret: env.KEAP_OAUTH_CLIENT_SECRET,
    refresh_token: tokens.refresh_token,
    store
  })

  const options = {
    optional_properties: 'social_accounts,website',
    pagination: {
      limit: 25,
      offset: 2,
      since: '2022-02-03T00:00:00.000Z',
      until: '2022-02-05T00:00:00.000Z'
    }
  }

  // we need to await because the generator retrieves the access token from the
  // store (e.g. filesystem store) during its configuration
  const asyncGen = await keap.contacts.retrieveAsyncGenerator(options)

  let count = 0
  for await (let paginated of asyncGen) {
    count += paginated.data.length
    console.log(
      `${count}/${
        paginated.count - options.pagination.offset
      } contacts retrieved`
    )

    console.log({
      previous: paginated.previous,
      next: paginated.next,
      batch: paginated.data.map(toSummary)
    })
  }
}

main()
