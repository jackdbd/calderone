# @jackdbd/audit

Application that retrieves records from [this Google Sheet](https://docs.google.com/spreadsheets/d/12Z3HBsRuuJp8yXTa9uaK2CzY6so_uIOrRGa8kaq8ZPk/edit#gid=0) and schedules web performance audits with [WebPageTest](https://docs.webpagetest.org/api/reference) using Google Cloud [Workflows](https://console.cloud.google.com/workflows?project=prj-kitchen-sink).

## Development

Build and watch the web application with `tsc` in watch mode and launch the application with `NODE_ENV = development`:

```sh
npm run dev -w packages/audit
```

## Build

### non-containerized application

Build the web application:

```sh
npm run build -w packages/audit
```

Start the application in a `development` / `test` environment:

```sh
npm run start:development -w packages/audit
npm run start:test -w packages/audit
```

### containerized application

Build a container image with [pack](https://buildpacks.io/docs/tools/pack):

```sh
npm run container:build -w packages/audit
```

Start the containerized application in a `development` / `production` / `test` environment:

```sh
npm run container:start:development -w packages/audit
npm run container:start:production -w packages/audit
npm run container:start:test -w packages/audit
```

## Deploy to GCP Cloud Run

Deploy to [Cloud Run](https://console.cloud.google.com/run?project=prj-kitchen-sink) using the `cloudbuild.yaml` file:

```sh
npm run deploy -w packages/audit
```

## Test

```sh
npm run test -w packages/audit
```

Healthcheck

```sh
curl "$AUDIT_URL/health" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

Schedule WebPageTest audits for up to `limit` rows retrieved from Google Sheets.

Each row in [this sheet](https://docs.google.com/spreadsheets/d/12Z3HBsRuuJp8yXTa9uaK2CzY6so_uIOrRGa8kaq8ZPk/edit#gid=0) (URLs to audit) will create as many WebPageTest audits as the rows of [this other sheet](https://docs.google.com/spreadsheets/d/12Z3HBsRuuJp8yXTa9uaK2CzY6so_uIOrRGa8kaq8ZPk/edit#gid=1920930137) (WebPageTest configuration).

```sh
curl -X POST \
-L "$AUDIT_URL/audit" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{
    "limit": 2
}'
```

The results will be visible on the [WebPageTest Test History page](https://app.webpagetest.org/ui/wpt/testhistory) when ready.
