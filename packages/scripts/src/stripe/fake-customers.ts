import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type Stripe from 'stripe'
import { StripeApiMode } from '@jackdbd/stripe-utils'
import { LOCALE_STRING_OPTIONS } from '@jackdbd/utils/dates'
import { monorepoRoot } from '@jackdbd/utils/path'
import { stripeClient } from './utils.js'

interface Customer {
  email: string
  first_name: string
  last_name: string
  city?: string
  codice_fiscale?: string
  country?: string
  postal_code?: number
  province?: string
  street_line_1?: string
  street_line_2?: string
}

export const main = async () => {
  const filepath = path.join(
    monorepoRoot(),
    'assets',
    'fakes',
    'customers.json'
  )

  const json_string = await readFile(filepath, { encoding: 'utf8' })
  const fake_customers = JSON.parse(json_string) as Customer[]

  const stripe = await stripeClient(StripeApiMode.Test)

  const created_by = 'fake-customers.ts script'

  const promises = fake_customers.map((c) => {
    const params: Stripe.CustomerCreateParams = {
      name: `${c.first_name} ${c.last_name}`,
      email: c.email,
      metadata: {
        created_by,
        created_at: new Date().toLocaleString('it-IT', LOCALE_STRING_OPTIONS)
      }
    }

    if (c.street_line_1) {
      const address: Stripe.AddressParam = {
        country: c.country,
        state: c.province,
        postal_code: c.postal_code ? `${c.postal_code}` : undefined,
        city: c.city,
        line1: c.street_line_1,
        line2: c.street_line_2
      }
      params.address = address
    }

    return stripe.customers.create(params)
  })

  const customers = await Promise.all(promises)
  console.log(`${customers.length} customers created`)
}

main()
