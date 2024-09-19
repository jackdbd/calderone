import type Stripe from 'stripe'

/**
 * @public
 */
export const reasonResourceWasDeleted = (id: string) =>
  `Stripe resource ${id} was deleted.`

/**
 * @public
 */
export interface Config {
  behavior: 'inclusive' | 'exclusive'
  price: Stripe.Price
  stripe: Stripe
  created_at?: string
  created_by?: string
}

/**
 * Create a new `Stripe.Price` with a defined `tax_behavior`.
 *
 * In Stripe we can update only `nickname` and `metadata` of a `Price`, so if we
 * need to define `tax_behavior` we have to create a new `Price`.
 *
 * @public
 * @experimental
 *
 * @see [Products and prices - Stripe Docs](https://stripe.com/docs/products-prices/overview)
 */
export const createPriceWithTaxBehavior = async ({
  behavior,
  price,
  stripe,
  created_at,
  created_by
}: Config) => {
  if (price.deleted) {
    throw new Error(reasonResourceWasDeleted(price.id))
  }
  if (!price.active) {
    throw new Error(`price ${price.id} is not active`)
  }
  if (!price.unit_amount) {
    throw new Error(`price ${price.id} has no unit_amount`)
  }

  let product_id: string
  if (typeof price.product === 'string') {
    product_id = price.product
  } else {
    if (price.product.deleted) {
      throw new Error(reasonResourceWasDeleted(price.product.id))
    } else {
      product_id = price.product.id
    }
  }
  // recreate the request body that created the original price
  const {
    created,
    id,
    livemode,
    lookup_key,
    nickname,
    object,
    product,
    recurring,
    tax_behavior,
    tiers,
    tiers_mode,
    transform_quantity,
    unit_amount,
    unit_amount_decimal,
    type,
    ...original_price
  } = price

  let custom_unit_amount:
    | Stripe.PriceCreateParams.CustomUnitAmount
    | undefined = undefined

  if (price.custom_unit_amount) {
    custom_unit_amount = {
      enabled: true,
      maximum: price.custom_unit_amount.maximum || undefined,
      minimum: price.custom_unit_amount.minimum || undefined,
      preset: price.custom_unit_amount.preset || undefined
    }
  }

  let price_recurring = undefined
  if (price.recurring) {
    const aggregate_usage = price.recurring.aggregate_usage || undefined
    const trial_period_days = price.recurring.trial_period_days || undefined
    price_recurring = {
      ...price.recurring,
      aggregate_usage,
      trial_period_days
    }
  }

  let currency_options = undefined
  if (original_price.currency_options) {
    currency_options = {} as {
      [k: string]: Stripe.PriceCreateParams.CurrencyOptions
    }
    for (const [k, v] of Object.entries(original_price.currency_options)) {
      let custom_unit_amount:
        | Stripe.PriceCreateParams.CurrencyOptions.CustomUnitAmount
        | undefined = undefined

      if (v.custom_unit_amount) {
        custom_unit_amount = {
          enabled: true,
          maximum: v.custom_unit_amount.maximum || undefined,
          minimum: v.custom_unit_amount.minimum || undefined,
          preset: v.custom_unit_amount.preset || undefined
        }
      }

      let tiers: Stripe.PriceCreateParams.Tier[] | undefined = undefined
      if (v.tiers) {
        tiers = v.tiers.map((tier) => {
          return {
            flat_amount: tier.flat_amount || undefined,
            flat_amount_decimal: tier.flat_amount_decimal || undefined,
            unit_amount: tier.unit_amount || undefined,
            unit_amount_decimal: tier.unit_amount_decimal || undefined,
            up_to: tier.up_to || 'inf'
          }
        })
      }

      currency_options[k] = {
        custom_unit_amount,
        tax_behavior: v.tax_behavior || undefined,
        tiers,
        unit_amount: v.unit_amount || undefined,
        unit_amount_decimal: v.unit_amount_decimal || undefined
      }
    }
  }

  let metadata = original_price.metadata
  if (created_at) {
    metadata = { ...metadata, created_at }
  }
  if (created_by) {
    metadata = { ...metadata, created_by }
  }

  const params: Stripe.PriceCreateParams = {
    ...original_price,
    currency_options,
    custom_unit_amount,
    metadata,
    nickname: nickname || `nickname of original price ${price.id}`,
    product: product_id,
    recurring: price_recurring as any,
    tax_behavior: behavior,
    unit_amount: price.unit_amount
  }

  const new_price = await stripe.prices.create(params)
  return new_price
}
