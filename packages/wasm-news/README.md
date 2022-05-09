# @jackdbd/wasm-news

Application that retrieves news about webassembly from several APIs (Reddit, Twitter, etc) and populates [this Google Sheets worksheet](https://docs.google.com/spreadsheets/d/1_px1dEv87iuDTTG6f6QfeSdNrGUhIsb941KDQwTOGLc).

## Development

Build and watch the web application with `tsc` in watch mode and launch the application with `NODE_ENV = development`:

```sh
npm run dev -w packages/wasm-news
```

## Build

### non-containerized application

Build the web application:

```sh
npm run build -w packages/wasm-news
```

Start the application in a `development` / `test` environment:

```sh
npm run start:development -w packages/wasm-news
npm run start:test -w packages/wasm-news
```

### containerized application

Build a container image with [pack](https://buildpacks.io/docs/tools/pack):

```sh
npm run container:build -w packages/wasm-news
```

Start the containerized application in a `development` / `production` / `test` environment:

```sh
npm run container:start:development -w packages/wasm-news
npm run container:start:production -w packages/wasm-news
npm run container:start:test -w packages/wasm-news
```

## Deploy to GCP Cloud Run

Deploy to [Cloud Run](https://console.cloud.google.com/run?project=prj-kitchen-sink) using the `cloudbuild.yaml` file:

```sh
npm run deploy -w packages/wasm-news
```

## Test

```sh
npm run test -w packages/wasm-news
```

Healthcheck

```sh
curl "$WASM_NEWS_URL/health" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

Retrieve data from GitHub

```sh
curl -X POST \
-L "$WASM_NEWS_URL/github" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{
    "n_days": 5
}'
```

Retrieve data from Reddit

```sh
curl -X POST \
-L "$WASM_NEWS_URL/reddit" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{}'
```

Retrieve data from Twitter

```sh
curl -X POST \
-L "$WASM_NEWS_URL/twitter" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{}'
```

Retrieve data from Stack Overflow

```sh
curl -X POST \
-L "$WASM_NEWS_URL/stack-overflow" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)" \
-H "Content-Type: application/json" \
-d '{}'
```

Delete all rows in the `github` worksheet

```sh
curl -X DELETE \
-L "$WASM_NEWS_URL/github" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

Delete all rows in the `reddit` worksheet

```sh
curl -X DELETE \
-L "$WASM_NEWS_URL/reddit" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

Delete all rows in the `stack_overflow` worksheet

```sh
curl -X DELETE \
-L "$WASM_NEWS_URL/stack-overflow" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)"
```

Delete all rows in the `twitter` worksheet

```sh
curl -X DELETE \
-L "$WASM_NEWS_URL/twitter" \
-H "Authorization: Bearer $(gcloud auth print-identity-token)"
```
