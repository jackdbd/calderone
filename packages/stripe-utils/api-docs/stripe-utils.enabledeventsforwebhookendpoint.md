<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/stripe-utils](./stripe-utils.md) &gt; [enabledEventsForWebhookEndpoint](./stripe-utils.enabledeventsforwebhookendpoint.md)

## enabledEventsForWebhookEndpoint variable

List of webhook events that the Stripe account `stripe` is allowed to send to the webhook endpoint `url`<!-- -->.

\*Note\*: you have to configure the events that Stripe sends to a webhook endpoint when you create/update a webhook endpoint in your Stripe account.

<b>Signature:</b>

```typescript
enabledEventsForWebhookEndpoint: ({ stripe, url }: EnabledEventsForWebhookEndpoint) => Promise<string[]>
```