# @jackdbd/secret-manager-utils

Utilities for Secret Manager.

## Build

Build this library:

```sh
npm run build -w packages/secret-manager-utils
```

## Test

```sh
npm run test -w packages/secret-manager-utils
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/secret-manager-utils
```

Check that the coreect version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/secret-manager-utils
```
