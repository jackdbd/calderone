# @jackdbd/checks

Functions to check inputs (i.e. predicates).

## Build

Build this library:

```sh
npm run build -w packages/checks
```

## Test

```sh
npm run test -w packages/checks
```

## Publish

### Artifact Registry

```sh
npm run publish:artifact-registry -w packages/checks
```

Check that the correct version of this package is now published on Artifact Registry:

```sh
gcloud artifacts versions list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/checks
```

### npmjs

Download a package previously published to Artifact Registry, and publish to npmjs too:

```sh
# refresh the token for Artifact Registry
npx google-artifactregistry-auth --repo-config .npmrc --credential-config ~/.npmrc

# https://stackoverflow.com/a/10856211/3036129
(export PACKAGE=checks; VERSION=$(cat ./packages/$PACKAGE/package.json | jq '.version'); ./scripts/publish/artifact-registry-to-npm.sh jackdbd $PACKAGE $VERSION)
```
