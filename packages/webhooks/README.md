# @jackdbd/webhooks

Application that receives webhook events from several third parties: [Cloud Monitoring](https://cloud.google.com/monitoring/support/notification-options#webhooks), [npm.js](https://docs.npmjs.com/cli/v7/commands/npm-hook), [Stripe](https://stripe.com/docs/webhooks), [WebPageTest](https://docs.webpagetest.org/api/reference), etc.

## Development

Start the **non-containerized** application and forward Stripe webhook events to localhost:8080:

```sh
npm run dev -w packages/webhooks
```

Or do the same thing, but with the containerized application:

```sh
npm run container:dev -w packages/webhooks
```

Note that you'll have to build the container image first:

```sh
npm run container:build -w packages/webhooks
```

### Older instructions, with ngrok

In another terminal, create a HTTPS => HTTP tunnel with [ngrok](https://ngrok.com/) on port 8080:

```sh
npx ngrok http 8080
```

Then visit http://localhost:4040/status to know the public URL ngrok assigned you, and assign it the `WEBHOOKS_URL` environment variable in the `.envrc`.

You can also visit to http://localhost:4040/inspect/http to inspect/replay past requests that were tunneled by ngrok.

## Deploy to GCP Cloud Run

This command uploads the source code to Cloud Build, which builds the container image and deploys the application as a [Cloud Run service](https://console.cloud.google.com/run?project=prj-kitchen-sin):

```sh
npm run deploy -w packages/webhooks
```

However, it's better to let a CI/CD pipeline deploy the application, instead of deploying it manually. To this purpose I configured a Cloud Build trigger (you can check [the YAML in this monorepo](../../cloud-build/triggers/git-push-github-repo-any-branch.yaml) and [the trigger on Cloud Build](https://console.cloud.google.com/cloud-build/triggers?project=prj-kitchen-sink)) that runs the steps defined in this package's `cloudbuild.yaml` on every code push, on every branch.

## API

The API documentation will be available at `$WEBHOOKS_URL/docs`, thanks to [hapi-swagger](https://github.com/hapi-swagger/hapi-swagger).

## Test

Build and watch the web application with `tsc` in watch mode:

```sh
npm run build:watch -w packages/webhooks
```

In another terminal, run the tests:

```sh
npm run test -w packages/webhooks
```

## Troubleshooting

Healthcheck

```sh
curl "$WEBHOOKS_URL/health"
```

The GET request coming from the [WebPageTest API pingback](https://docs.webpagetest.org/api/reference/#full-list-of-parameters) looks like this one:

```sh
curl "$WEBHOOKS_URL/webpagetest?id=12345" \
-H "Content-Type: application/json"
```

For example, run a WebPageTest and pass `$WEBHOOKS_URL/webpagetest` as the `pingback`:

```sh
curl "https://www.webpagetest.org/runtest.php?url=https://www.google.com/&k=${WEBPAGETEST_API_KEY}&pingback=${WEBHOOKS_URL}/webpagetest&f=json" | jq
```

POST request made by a [npm hook](https://docs.npmjs.com/cli/v8/commands/npm-hook):

```sh
curl -X POST \
-L "$WEBHOOKS_URL/npm" \
-H "Content-Type: application/json" \
--data-binary "@./assets/webhook-events/npm-package-change.json"
```

List the webhooks registered with npm.js with `npm hook ls`.

POST request made by a [Stripe webhook](https://stripe.com/docs/webhooks):

```sh
stripe trigger --api-key $STRIPE_API_KEY_TEST customer.created
```

POST request made by Cloud Monitoring when an [uptime check](https://cloud.google.com/monitoring/uptime-checks) fails:

```sh
curl -X POST \
-L "$WEBHOOKS_URL/alerts" \
-H "Content-Type: application/json" \
--data-binary "@./assets/webhook-events/monitoring-incident.json"
```
