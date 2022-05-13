# @jackdbd/hapi-healthcheck-plugin

Hapi plugin for a healthcheck.

## Build

Build this library:

```sh
npm run build -w packages/hapi-healthcheck-plugin
```

## Test

```sh
npm run test -w packages/hapi-healthcheck-plugin
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/hapi-healthcheck-plugin
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/hapi-healthcheck-plugin
```
