# @jackdbd/webhooks

Application that receives webhook events from several third parties: [Netlify](https://docs.netlify.com/site-deploys/post-processing/form-detection/#outgoing-webhooks), [Stripe](https://stripe.com/docs/webhooks), [WebPageTest](https://docs.webpagetest.org/api/reference), etc.

## Development

Build and watch the web application with `tsc` in watch mode, create a HTTPS => HTTP tunnel with [ngrok](https://ngrok.com/) on port 8080 and launch the application with `NODE_ENV = development`:

```sh
npm run dev -w packages/webhooks
```

Then visit http://localhost:4040/status to know the public URL ngrok assigned you, and go to http://localhost:4040/inspect/http to inspect/replay past requests that were tunneled by ngrok.

## Build

### non-containerized application

Build the web application:

```sh
npm run build -w packages/webhooks
```

Start the application in a `development` / `test` environment:

```sh
npm run start:development -w packages/webhooks
npm run start:test -w packages/webhooks
```

### containerized application

Build a container image with [pack](https://buildpacks.io/docs/tools/pack):

```sh
npm run container:build -w packages/webhooks
```

Start the containerized application in a `development` / `production` / `test` environment:

```sh
npm run container:start:development -w packages/webhooks
npm run container:start:production -w packages/webhooks
npm run container:start:test -w packages/webhooks
```

## Deploy to GCP Cloud Run

This command uploads the source code to Cloud Build, which build the container image and deploys the application as a [Cloud Run service](https://console.cloud.google.com/run?project=prj-kitchen-sin):

```sh
npm run deploy -w packages/webhooks
```

However, it's better to let a CI/CD pipeline deploy the application, instead of deploying it manually. To this purpose I configured a [Cloud Build trigger](../../cloud-build-triggers/README.md) that runs the steps defined in this package's `cloudbuild.yaml` on every code push, on every branch.

## Test

```sh
npm run test -w packages/webhooks
```

Healthcheck

```sh
curl "$WEBHOOKS_URL/health"
```

Monitor endpoint

```sh
curl "$WEBHOOKS_URL/monitor"
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

The POST request made by the Netlify API when there is a form submission on my website looks like this one (run this code from the monorepo root):

```sh
curl -X POST \
-L "$WEBHOOKS_URL/netlify" \
-H "Content-Type: application/json" \
--data-binary "@./secrets/netlify-form-submission.json"
```

```sh
curl -X POST \
-L "$WEBHOOKS_URL/alerts" \
-H "Content-Type: application/json" \
-data-binary "@./assets/fakes/incident.json"
```

## Documentation

API docs available at `$WEBHOOKS_URL/docs`.
