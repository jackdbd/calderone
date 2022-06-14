# Artifact Registry

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

Enable [Artifact Registry](https://cloud.google.com/artifact-registry):

```sh
gcloud services enable artifactregistry.googleapis.com
```

## npm registry

Create npm registry to host some Node.js libraries (aka npm packages):

```sh
gcloud artifacts repositories create $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --repository-format npm \
  --description "Node.js package repository" \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --labels=customer=$CUSTOMER,environment=$ENVIRONMENT
```

The following command returns configuration settings to add to your `.npmrc` (npm configuration file). `@jackdbd` is the npm [scope](https://docs.npmjs.com/about-scopes).

```sh
gcloud artifacts print-settings npm \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --scope @jackdbd
```

You can keep this `.npmrc` under source control because it is the **per-project** config file. You will also have a per-user `.npmrc` which credentials are stored, tipically in `~/.npmrc`. The access tokens required to access Artifact Registry will be stored in your `~./npmrc`, which should not be committed in git.

You can refresh the tokens using this [google-artifactregistry-auth](https://github.com/GoogleCloudPlatform/artifact-registry-npm-tools#readme) command from the monorepo root:

```sh
npx google-artifactregistry-auth \
  --repo-config ./config/npm-config-repo \
  --credential-config ~/.npmrc \
  --verbose
```

The OAuth 2.0 access token obtained is [valid for one hour](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials#sa-credentials-oauth) (even if its lifetime can be extended [up to 12 hours](https://stackoverflow.com/a/69712755/3036129)).

A couple of things on the [npm config file](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc):

- The [project-config](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc#per-project-config-file) `.npmrc` is tracked in this repository (see the [config directory](./config/README.md)).
- The [user-config](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc#per-user-config-file) `.npmrc` is not tracked in git because it contains the access tokens (for both Artifact Registry and npmjs).

```sh
npx google-artifactregistry-auth \
  --repo-config ./config/npm-config-repo \
  --credential-config ~/.npmrc \
  --verbose
```


### List of npm packages published

See the list of packages published to Artifact Registry:

```sh
gcloud artifacts packages list \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION
```

### List published versions of a npm package

See the list of versions of the package @jackdbd/checks published to Artifact Registry:

```sh
gcloud artifacts versions list \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/checks \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID
```

See the latest version of the package @jackdbd/checks published to Artifact Registry (see [this answer](https://stackoverflow.com/questions/72130466/how-to-get-latest-version-of-an-image-from-artifact-registry) on Stack Overflow):

```sh
gcloud artifacts versions list \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --package @jackdbd/checks \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --sort-by="~UPDATE_TIME" \
  --limit=1 \
  --format="value(format("{0}",name))"
```

## Docker registry

The Docker registry will host the container images built with `gcloud run deploy`

```sh
gcloud artifacts repositories create $ARTIFACT_REGISTRY_DOCKER_REPOSITORY_ID \
  --repository-format docker \
  --description "Repository for container images" \
  --location $ARTIFACT_REGISTRY_DOCKER_REPOSITORY_LOCATION \
  --labels=customer=$CUSTOMER,environment=$ENVIRONMENT
```
