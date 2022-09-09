/**
 * Stripe API mode.
 *
 * @see [Test and live modes overview](https://stripe.com/docs/keys#test-live-modes)
 */
export enum StripeApiMode {
  Live = 'LIVE', // production environment
  Test = 'TEST' // test environment
}

/**
 * Stripe tax codes.
 *
 * @see [Available tax categories](https://stripe.com/docs/tax/tax-codes)
 */
export enum StripeTaxCode {
  AudioBooks = 'txcd_10301000',
  Books = 'txcd_35010000',
  DigitalBooksDownloadedNonSubscriptionWithPermanentRights = 'txcd_10302000',
  ElectronicallySuppliedServices = 'txcd_10000000',
  Nontaxable = 'txcd_00000000',
  Services = 'txcd_20030000',
  TangibleGoods = 'txcd_99999999'
}
