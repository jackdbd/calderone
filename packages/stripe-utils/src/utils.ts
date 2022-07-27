/**
 * Given a Stripe API key, infers whether the Stripe client was initialized in
 * `live` mode or `test` mode.
 *
 * @public
 *
 * @see [Testing - Stripe Docs](https://stripe.com/docs/testing)
 * @see [Test and live modes overview - Stripe Docs](https://stripe.com/docs/keys#test-live-modes)
 */
export const stripeAccountMode = (api_key: string) => {
  return api_key.slice(0, 8) === 'sk_live_' ? 'live' : 'test'
}

/**
 * Bind method to this.
 *
 * A few methods in stripe-node (e.g. create, retrieve) need `this` to be
 * stripe.customers when they are called, so if we need to pass just the method
 * and not the entire Stripe client, we need to bind the method first.
 *
 * @public
 */
export function boundMethod(thisObject: any, method_name: string) {
  return thisObject[method_name].bind(thisObject)
}
