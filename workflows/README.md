# Google Cloud Workflows

See [Cloud Workflows predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#workflows-roles).

All GCP workflows are named `*.workflows.yaml`. TODO: do I need to have `.workflows` in the file name?

## Deploy a Workflow to GCP

This command will deploy the specified workflow in the `CLOUDSDK_CORE_PROJECT` GCP project, where `CLOUDSDK_CORE_PROJECT` is an environment variable used by gcloud.

From the monorepo root:

```sh
gcloud workflows deploy random-cocktail-to-telegram \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Get a random cocktail from thecocktaildb.com and send it to Telegram and email" \
  --source workflows/random-cocktail-to-telegram.workflows.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

```sh
gcloud workflows deploy create-stop-delete-vm \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Create, start, stop, delete a VM using the Compute Engine Workflows Connector" \
  --source workflows/create-stop-delete-vm.workflows.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

```sh
gcloud workflows deploy wasm-news \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Search several APIs for news about WebAssembly topics and store them in Google Sheets" \
  --source workflows/wasm-news.workflows.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

```sh
gcloud workflows deploy lead-generation \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Lead generation to find clients" \
  --source workflows/lead-generation.workflows.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

Note: `--location` is required, unless it is specified in a gcloud config file.

## `execute` vs `run`

Use `gcloud workflows execute` to execute a workflow without waiting for it to complete.

```sh
gcloud workflows execute random-cocktail-to-telegram \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION
```

```sh
gcloud workflows execute lead-generation \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION
```

Use `gcloud workflows run` to execute a workflow and wait for it to complete.

```sh
gcloud workflows run random-cocktail-to-telegram \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --format='value(result)' \
```

```sh
gcloud workflows run wasm-news \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION
```

Notes:

- `--format='value(result)'` is optional. It's just to extract the result from the response.
- `--location` is required, unless it is specified in a gcloud config file.

### If the workflow requires no input data

```sh
gcloud workflows run quickstart \
   --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --format 'value(result)'
```

### If the workflow requires input data

A workflow requires input data if it has:

```yaml
main:
  params: [args]
```

For example:

```sh
gcloud workflows execute create-stop-delete-vm \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --data '{
    "imageId": "projects/debian-cloud/global/images/debian-11-bullseye-v20220406",
    "instanceName": "example-debian-instance"
  }'
```
