# @jackdbd/utils

Functions to check inputs (i.e. predicates).

## Build

Build this library:

```sh
npm run build -w packages/utils
```

## Test

```sh
npm run test -w packages/utils
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/utils
```

Check that the coreect version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/utils
```
