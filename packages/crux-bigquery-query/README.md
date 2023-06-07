# @jackdbd/crux-bigquery-query

Run a query against the [BigQuery CrUX dataset](https://developer.chrome.com/docs/crux/bigquery/).

## Installation

```sh
npm install
```

## Development

In one terminal, watch the function and auto-reload it with [entr](https://github.com/eradman/entr).

```sh
npm run dev -w packages/crux-bigquery-query
```

In another terminal, call the function with curl or any other HTTP client.

Example: all defaults.

```sh
curl "${CRUX_BIGQUERY_FUNCTION_URL}" \
  -X POST | jq
```

Example: params from request body.

```sh
curl "${CRUX_BIGQUERY_FUNCTION_URL}" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "country_code": "DE",
    "slow_ttfb": 0.25
  }' | jq
```

```sh
curl -m 40 -X POST https://crux-bigquery-query-45eyyotfta-ey.a.run.app \
-H "Authorization: bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{
  "country_code": "DE"
}'
```

Example: params from query string.

```sh
curl "${CRUX_BIGQUERY_FUNCTION_URL}?country_code=DE&slow_ttfb=0.25" \
  -X POST | jq
```

```sh
gcloud functions call crux-bigquery-query \
  --gen2 \
  --data '{"country_code": "UK", "slow_ttfb": 0.25}'
```

## Test

Run integration tests with [SuperTest](https://github.com/visionmedia/supertest) and Jest:

```sh
npm run test -w packages/crux-bigquery-query
```

## Deploy

This command uploads the source code to Cloud Build, which deploys the application to [Cloud Functions (2nd generation)](https://cloud.google.com/functions/docs/concepts/version-comparison):

```sh
npm run deploy -w packages/crux-bigquery-query
```
