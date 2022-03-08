# @jackdbd/sqlite-utils

Utility functions to work with SQLite.

## Build

Build this library:

```sh
npm run build -w packages/sqlite-utils
```

## Test

```sh
npm run test -w packages/sqlite-utils
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/sqlite-utils
```

Check that the coreect version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/sqlite-utils
```
