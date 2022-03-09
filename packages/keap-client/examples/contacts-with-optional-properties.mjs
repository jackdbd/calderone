import path from 'path'
import { env } from 'process'
import { monorepoRoot } from '../lib/utils.js'
import { fsStore } from '../lib/tokens-stores/fs.js'
import { storeKeapClient } from '../lib/clients.js'

// retrieve the contact's optional_properties with a GET to:
// https://api.infusionsoft.com/crm/rest/v1/contacts/model
const customFields = (custom_fields) => {
  const m = {
    codice_fiscale: undefined,
    partita_iva: undefined,
    spesa_complessiva: undefined,
    stripe_customer_id: undefined
  }

  for (const field of custom_fields) {
    // this number->key mapping is user-specific
    switch (field.id) {
      case 43:
        m.codice_fiscale = field.content || undefined
        break
      case 45:
        m.partita_iva = field.content || undefined
        break
      case 55:
        m.spesa_complessiva = field.content || undefined
        break
      case 61:
        m.stripe_customer_id = field.content || undefined
        break
      default:
        break
    }
  }

  return m
}

const toSummary = ({ custom_fields, email_addresses, given_name, notes }) => {
  return {
    emails: email_addresses.map((d) => d.email).join(','),
    name: given_name,
    notes: notes || undefined,
    ...customFields(custom_fields)
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

  // https://community.keap.com/t/trying-to-retrieve-contact-using-your-rest-api/12531
  const contacts = await keap.contacts.retrieve({
    optional_properties: 'custom_fields,notes',
    pagination: { limit: 100, offset: 500 }
  })
  const summaries = contacts.data.map(toSummary)
  console.log('Keap contacts', summaries)
}

main()
