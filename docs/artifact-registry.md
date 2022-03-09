# Artifact Registry

Enable [Artifact Registry](https://cloud.google.com/artifact-registry):

```sh
gcloud services enable artifactregistry.googleapis.com --project $GCP_PROJECT_ID
```

## npm registry

Create npm registry to host some Node.js libraries (aka npm packages):

```sh
gcloud artifacts repositories create $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --repository-format npm \
  --description "Node.js package repository" \
  --project $GCP_PROJECT_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --labels=customer=$CUSTOMER,environment=$ENVIRONMENT
```

The following command returns configuration settings to add to your `.npmrc` (npm configuration file). `@jackdbd` is the npm [scope](https://docs.npmjs.com/about-scopes).

```sh
gcloud artifacts print-settings npm \
  --project $GCP_PROJECT_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --scope @jackdbd
```

You can keep this `.npmrc` under source control because it is the **per-project** config file. You will also have a per-user `.npmrc` which credentials are stored, tipically in `~/.npmrc`. The access tokens required to access Artifact Registry will be stored in your `~./npmrc`, which should not be committed in git.

You can refresh the tokens using this [google-artifactregistry-auth](https://github.com/GoogleCloudPlatform/artifact-registry-npm-tools#readme) command from the monorepo root:

```sh
npx google-artifactregistry-auth --repo-config .npmrc
```

### List of npm packages published

See the list of packages published to Artifact Registry:

```sh
gcloud artifacts packages list \
  --project $GCP_PROJECT_ID \
  --repository $ARTIFACT_REGISTRY_NPM_REPOSITORY_ID \
  --location $ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION
```

## Docker registry

The Docker registry will host the container images built with `gcloud run deploy`

```sh
gcloud artifacts repositories create $ARTIFACT_REGISTRY_DOCKER_REPOSITORY_ID \
  --repository-format docker \
  --description "Repository for container images" \
  --project $GCP_PROJECT_ID \
  --location $ARTIFACT_REGISTRY_DOCKER_REPOSITORY_LOCATION \
  --labels=customer=$CUSTOMER,environment=$ENVIRONMENT
```
