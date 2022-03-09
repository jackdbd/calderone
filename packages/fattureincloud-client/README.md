# @jackdbd/fattureincloud-client

Unofficial API client for [FattureInCloud](https://www.fattureincloud.it/) with auto-pagination and optional rate-limits.

## Build

Build this library:

```sh
npm run build -w packages/fattureincloud-client
```

## Test

```sh
npm run test -w packages/fattureincloud-client
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/fattureincloud-client
```

Check that the coreect version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/fattureincloud-client
```
