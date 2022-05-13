# @jackdbd/telegram-text-messages

Factory functions that return HTML-formatted strings to use in the `text` field of the [sendMessage](https://core.telegram.org/bots/api#sendmessage) method of the Telegram Bot API.

## Build

Build this library:

```sh
npm run build -w packages/telegram-text-messages
```

## Test

```sh
npm run test -w packages/telegram-text-messages
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/telegram-text-messages
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/telegram-text-messages
```
