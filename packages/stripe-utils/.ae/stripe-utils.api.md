## API Report File for "@jackdbd/stripe-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import Stripe from 'stripe';

// Warning: (ae-forgotten-export) The symbol "Config" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "createPriceWithTaxBehavior" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const createPriceWithTaxBehavior: ({ behavior, price, stripe, created_at, created_by }: Config_2) => Promise<Stripe.Response<Stripe.Price>>;

// Warning: (ae-forgotten-export) The symbol "Config" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "customerFromPaymentIntentId" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const customerFromPaymentIntentId: ({ stripe, pi_id }: Config) => Promise<{
    error: Error;
    value?: undefined;
} | {
    value: Stripe.Customer;
    error?: undefined;
}>;

// Warning: (ae-forgotten-export) The symbol "EmailIds" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "duplicates" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const duplicates: ({ stripe, threshold, ts_start, ts_stop }: DuplicatesConfig) => Promise<EmailIds>;

// Warning: (ae-missing-release-tag) "DuplicatesConfig" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface DuplicatesConfig {
    // (undocumented)
    stripe: Stripe;
    // (undocumented)
    threshold?: number;
    // (undocumented)
    ts_start: number;
    // (undocumented)
    ts_stop: number;
}

// Warning: (ae-forgotten-export) The symbol "EnabledEventsForWebhookEndpoint" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "enabledEventsForWebhookEndpoint" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const enabledEventsForWebhookEndpoint: ({ stripe, url }: EnabledEventsForWebhookEndpoint) => Promise<string[]>;

// Warning: (ae-missing-release-tag) "errorFromStripe" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const errorFromStripe: (err: Stripe.StripeError) => {
    code: string | undefined;
    message: string;
    param: string | undefined;
    status_code: number;
};

// Warning: (ae-missing-release-tag) "isApiKeyLiveMode" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const isApiKeyLiveMode: (s: string) => boolean;

// Warning: (ae-missing-release-tag) "isApiKeyTestMode" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const isApiKeyTestMode: (s: string) => boolean;

// Warning: (ae-missing-release-tag) "stripeAccountMode" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const stripeAccountMode: (api_key: string) => "live" | "test";

// (No @packageDocumentation comment for this package)

```