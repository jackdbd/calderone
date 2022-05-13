# @jackdbd/schemas

JSON schemas with [Ajv](https://ajv.js.org/).

## Build

Build this library:

```sh
npm run build -w packages/schemas
```

## Test

```sh
npm run test -w packages/schemas
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/schemas
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/schemas
```
