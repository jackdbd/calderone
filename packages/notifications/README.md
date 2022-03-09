# @jackdbd/notifications

Functions used to send notifications to various channels (Telegram, email, etc).

## Build

Build this library:

```sh
npm run build -w packages/notifications
```

## Test

```sh
npm run test -w packages/notifications
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/notifications
```

Check that the coreect version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/notifications
```
