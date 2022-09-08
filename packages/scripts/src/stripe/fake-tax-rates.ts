import { StripeApiMode } from '@jackdbd/stripe-utils'
import { LOCALE_STRING_OPTIONS } from '@jackdbd/utils/dates'
import type Stripe from 'stripe'
import { stripeClient } from './utils.js'

export const main = async () => {
  const stripe = await stripeClient(StripeApiMode.Test)

  const created_by = 'fake-tax-rates.ts script'

  // Tax rates cannot deleted, only archived.
  // https://github.com/stripe/stripe-node#auto-pagination
  // for await (const tax_rate of stripe.taxRates.list({ active: true })) {
  //   await stripe.taxRates.update(tax_rate.id, { active: false })
  //   console.log(`[${created_by}] archived ${tax_rate.id}`)
  // }

  const promises = [4, 22].map((percentage) => {
    const params: Stripe.TaxRateCreateParams = {
      country: 'IT',
      description: `IVA ${percentage}% inclusa (da scorporare dal prezzo lordo)`,
      display_name: 'IVA',
      inclusive: true,
      metadata: {
        created_by,
        created_at: new Date().toLocaleString('it-IT', LOCALE_STRING_OPTIONS)
      },
      percentage,
      tax_type: 'vat'
    }
    return stripe.taxRates.create(params)
  })

  const tax_rates = await Promise.all(promises)
  console.log(`${tax_rates.length} tax rates created`)
}

main()
