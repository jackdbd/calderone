# @jackdbd/hapi-ip-whitelist-plugin

Hapi plugin to allow an IP whitelist.

## Build

Build this library:

```sh
npm run build -w packages/hapi-ip-whitelist-plugin
```

## Test

```sh
npm run test -w packages/hapi-ip-whitelist-plugin
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/hapi-ip-whitelist-plugin
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/hapi-ip-whitelist-plugin
```
