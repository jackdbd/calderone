# @jackdbd/firestore-utils

Utility functions to work with Firestore.

## Build

Build this library:

```sh
npm run build -w packages/firestore-utils
```

## Test

```sh
npm run test -w packages/firestore-utils
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/firestore-utils
```

Check that the coreect version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/firestore-utils
```
