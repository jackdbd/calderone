export const stripeAccountMode = (api_key: string) => {
  return api_key.slice(0, 8) === "sk_live_" ? "live" : "test";
};

/**
 * Bind method to this.
 *
 * A few methods in stripe-node (e.g. create, retrieve) need `this` to be
 * stripe.customers when they are called, so if we need to pass just the method
 * and not the entire Stripe client, we need to bind the method first.
 */
export function boundMethod(thisObject: any, method_name: string) {
  return thisObject[method_name].bind(thisObject);
}
