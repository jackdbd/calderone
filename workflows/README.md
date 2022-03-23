# Google Cloud Workflows

See [Cloud Workflows predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#workflows-roles).

All GCP workflows are named `*.workflows.yaml`. TODO: do I need to have `.workflows` in the file name?

## Deploy a Workflow to GCP

This command will deploy the specified workflow in the `CLOUDSDK_CORE_PROJECT` GCP project, where `CLOUDSDK_CORE_PROJECT` is an environment variable used by gcloud.

From the monorepo root:

```sh
gcloud workflows deploy random-cocktail-to-telegram \
  --location europe-west4 \
  --description "Get a random cocktail from thecocktaildb.com and send it to Telegram and email" \
  --source workflows/random-cocktail-to-telegram.workflows.yaml \
  --service-account sa-workflows-runner@prj-kitchen-sink.iam.gserviceaccount.com \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

```sh
gcloud workflows deploy create-stop-delete-vm \
  --location europe-west4 \
  --description "Create, start, stop, delete a VM using the Compute Engine Workflows Connector" \
  --source workflows/create-stop-delete-vm.workflows.yaml \
  --service-account sa-workflows-runner@prj-kitchen-sink.iam.gserviceaccount.com \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

```sh
gcloud workflows deploy wasm-news \
  --location europe-west4 \
  --description "Search several APIs for news about WebAssembly topics" \
  --source workflows/wasm-news.workflows.yaml \
  --service-account $SA_WASM_NEWS \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

Note: `--location` is required, unless it is specified in a gcloud config file.

## `execute` vs `run`

Use `gcloud workflows execute` to execute a workflow without waiting for it to complete.

```sh
gcloud workflows execute random-cocktail-to-telegram \
  --location europe-west4
```

Use `gcloud workflows run` to execute a workflow and wait for it to complete.

```sh
gcloud workflows run random-cocktail-to-telegram \
  --format='value(result)' \
  --location europe-west4
```

```sh
gcloud workflows run wasm-news \
  --location europe-west4
```

Notes:

- `--format='value(result)'` is optional. It's just to extract the result from the response.
- `--location` is required, unless it is specified in a gcloud config file.

### If the workflow requires no input data

```sh
gcloud workflows run quickstart \
  --location=europe-west4 \
  --format='value(result)'
```

### If the workflow requires input data

A workflow requires input data if it has:

```yaml
main:
  params: [args]
```

Let's say that a workflow requires this JSON as input data.

```json
{
    "firstName": "John",
    "lastName": "Smith"
}
```

First, convert it to a JSON string with `JSON.stringify(data)`, then use the JSON stringified value.

```sh
gcloud workflows run args \
  --data="{\"firstName\":\"John\",\"lastName\":\"Smith\"}" \
  --location=europe-west4 \
  --format='value(result)'
```

```sh
gcloud workflows execute create-stop-delete-vm \
  --data="{\"instanceName\":\"my-vm-instance\"}"
```
