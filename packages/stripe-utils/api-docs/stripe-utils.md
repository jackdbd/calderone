<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/stripe-utils](./stripe-utils.md)

## stripe-utils package

Utility functions that might be useful when working with Stripe.

## Enumerations

<table><thead><tr><th>

Enumeration


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[StripeApiMode](./stripe-utils.stripeapimode.md)


</td><td>

Stripe API mode.


</td></tr>
<tr><td>

[StripeTaxCode](./stripe-utils.stripetaxcode.md)


</td><td>

Stripe tax codes.


</td></tr>
</tbody></table>

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[createPriceWithTaxBehavior({ behavior, price, stripe, created\_at, created\_by })](./stripe-utils.createpricewithtaxbehavior.md)


</td><td>

Create a new `Stripe.Price` with a defined `tax_behavior`<!-- -->.

In Stripe we can update only `nickname` and `metadata` of a `Price`<!-- -->, so if we need to define `tax_behavior` we have to create a new `Price`<!-- -->.


</td></tr>
<tr><td>

[customerFromPaymentIntentId({ stripe, pi\_id })](./stripe-utils.customerfrompaymentintentid.md)


</td><td>

Extracts the Stripe Customer from a Payment Intent Id.


</td></tr>
<tr><td>

[customersWithDuplicateEmails({ stripe, ts\_ms\_begin, ts\_ms\_end })](./stripe-utils.customerswithduplicateemails.md)


</td><td>

Finds all customers whose email appear more than once in the Stripe account.

The search is restricted to the time interval `[ts_md_begin, ts_md_end]`<!-- -->.


</td></tr>
<tr><td>

[duplicates({ stripe, threshold, ts\_start, ts\_stop })](./stripe-utils.duplicates.md)


</td><td>

Emails that appear more than `threshold` times in the given Stripe account. The search is restricted to the time range starting from `ts_start` to `ts_stop` (both excluded, and both expressed in Unix timestamps in seconds).


</td></tr>
<tr><td>

[enabledEventsForWebhookEndpoint({ stripe, url })](./stripe-utils.enabledeventsforwebhookendpoint.md)


</td><td>

List of webhook events that the Stripe account `stripe` is allowed to send to the webhook endpoint `url`<!-- -->.

\*Note\*: you have to configure the events that Stripe sends to a webhook endpoint when you create/update a webhook endpoint in your Stripe account.


</td></tr>
<tr><td>

[errorFromStripe(err)](./stripe-utils.errorfromstripe.md)


</td><td>

Converts an error coming from Stripe into an object with a consistent shape.


</td></tr>
<tr><td>

[isApiKeyLiveMode(s)](./stripe-utils.isapikeylivemode.md)


</td><td>

Checks whether the given string is an API key for a Stripe account in `live` mode.


</td></tr>
<tr><td>

[isApiKeyTestMode(s)](./stripe-utils.isapikeytestmode.md)


</td><td>

Checks whether the given string is an API key for a Stripe account in `test` mode.


</td></tr>
<tr><td>

[stripeAccountMode(api\_key)](./stripe-utils.stripeaccountmode.md)


</td><td>

Given a Stripe API key, infers whether the Stripe client was initialized in `live` mode or `test` mode.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[ConfigCustomersWithDuplicateEmails](./stripe-utils.configcustomerswithduplicateemails.md)


</td><td>


</td></tr>
<tr><td>

[CreatePriceWithTaxBehaviorConfig](./stripe-utils.createpricewithtaxbehaviorconfig.md)


</td><td>



</td></tr>
<tr><td>

[CustomerFromPaymentIntentIdConfig](./stripe-utils.customerfrompaymentintentidconfig.md)


</td><td>


</td></tr>
<tr><td>

[CustomersByEmail](./stripe-utils.customersbyemail.md)


</td><td>


</td></tr>
<tr><td>

[DuplicatesConfig](./stripe-utils.duplicatesconfig.md)


</td><td>



</td></tr>
<tr><td>

[EmailIds](./stripe-utils.emailids.md)


</td><td>



</td></tr>
<tr><td>

[EnabledEventsForWebhookEndpoint](./stripe-utils.enabledeventsforwebhookendpoint.md)


</td><td>


</td></tr>
</tbody></table>
