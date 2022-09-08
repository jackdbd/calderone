import type Stripe from 'stripe'
import { StripeApiMode, StripeTaxCode } from '@jackdbd/stripe-utils'
import { LOCALE_STRING_OPTIONS } from '@jackdbd/utils/dates'
import { stripeClient } from './utils.js'

interface ProductConfig {
  description?: string
  name: string
  type: 'audio' | 'digital' | 'paper'
}

const CREATED_BY = 'fake-products-and-prices.ts script'

const defBook = (config: ProductConfig) => {
  const { description, name } = config
  let tax_code: string
  switch (config.type) {
    case 'audio': {
      tax_code = StripeTaxCode.AudioBooks
      break
    }
    case 'digital': {
      tax_code =
        StripeTaxCode.DigitalBooksDownloadedNonSubscriptionWithPermanentRights
      break
    }
    case 'paper': {
      tax_code = StripeTaxCode.Books
      break
    }
    default: {
      throw new Error(`NOT IMPLEMENTED: ${config.type}`)
    }
  }
  return {
    description,
    metadata: {
      created_by: CREATED_BY,
      created_at: new Date().toLocaleString('it-IT', LOCALE_STRING_OPTIONS)
    },
    name,
    tax_code,
    type: 'good'
  } as Stripe.ProductCreateParams
}

export const main = async () => {
  const stripe = await stripeClient(StripeApiMode.Test)

  // books are products of type 'good' and will have a one-time price associated to them
  const books = [
    defBook({ name: 'The Lord of the Rings', type: 'paper' }),
    defBook({ name: 'Snow Crash', type: 'audio' }),
    defBook({
      name: 'Mazes for Programers',
      description: 'code your own twisty passages',
      type: 'digital'
    }),
    defBook({
      name: 'The personal MBA',
      description: 'a world-class business education in a single volume',
      type: 'digital'
    })
  ]

  const promises = books.map((book) => stripe.products.create(book))

  const products = await Promise.all(promises)
  console.log(`${products.length} products created`)

  const prices = products.map((product, i) => {
    const params: Stripe.PriceCreateParams = {
      currency: 'eur',
      metadata: {
        created_by: CREATED_BY,
        created_at: new Date().toLocaleString('it-IT', LOCALE_STRING_OPTIONS)
      },
      nickname: 'time-limited offer',
      product: product.id,
      // recurring: { interval: plan.interval },
      tax_behavior: 'inclusive', // VAT is included and must be unbundled (i.e. must be separated)
      unit_amount: (i + 1) * 100
    }
    return stripe.prices.create(params)
  })

  console.log(`${prices.length} prices created`)
}

main()
