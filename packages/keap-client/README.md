# @jackdbd/keap-client

Unofficial API client for [Keap (aka Infusionsoft)](https://keap.com/).

## Build

Build this library:

```sh
npm run build -w packages/keap-client
```

## Test

```sh
npm run test -w packages/keap-client
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/keap-client
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/keap-client
```
