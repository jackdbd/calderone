# @jackdbd/stripe-utils

Utility functions to work with Stripe.

## Build

Build this library:

```sh
npm run build -w packages/stripe-utils
```

## Test

```sh
npm run test -w packages/stripe-utils
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/stripe-utils
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/stripe-utils
```
