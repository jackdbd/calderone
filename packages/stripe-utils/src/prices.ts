import type Stripe from 'stripe'

export const reasonResourceWasDeleted = (id: string) =>
  `Stripe resource ${id} was deleted.`

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
 * https://stripe.com/docs/billing/subscriptions/products-and-prices#changing-prices
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

  let custom_unit_amount = undefined
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

  let metadata = original_price.metadata
  if (created_at) {
    metadata = { ...metadata, created_at }
  }
  if (created_by) {
    metadata = { ...metadata, created_by }
  }

  const new_price = await stripe.prices.create({
    ...original_price,
    custom_unit_amount,
    metadata,
    nickname: nickname || `nickname of original price ${price.id}`,
    product: product_id,
    recurring: price_recurring,
    tax_behavior: behavior,
    unit_amount: price.unit_amount
  })

  return new_price
}
