# Google Cloud Workflows

Useful links:

- [Cloud Workflows predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#workflows-roles)

## Deploy a Workflow to GCP

All of the following commands are meant to be executed from the monorepo root. The environment variable `WORKFLOW_LOCATION` is set to `europe-west4`. The environment variable `SA_WORKFLOWS_RUNNER` is the service account attached to each GCP Workflow.

```sh
gcloud workflows deploy random-cocktail \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Get a random cocktail from thecocktaildb.com" \
  --source workflows/random-cocktail.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

```sh
gcloud workflows deploy create-stop-delete-vm \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Create, start, stop, delete a VM using the Compute Engine Workflows Connector" \
  --source workflows/create-stop-delete-vm.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

### Lead generation

```sh
gcloud workflows deploy lead-generation \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Lead generation to find clients, jobs, people on Hacker News, LinkedIn, Reddit" \
  --source workflows/lead-generation.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

### Serverless data pipeline

```sh
gcloud workflows deploy serverless-data-pipeline \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Serverless data pipeline (variation of the codelab 'Building a Serverless Data Pipeline: IoT to Analytics')" \
  --source workflows/serverless-data-pipeline.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

### Web performance audit

```sh
gcloud workflows deploy webperf-audit \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Web performance audit with WebPageTest and the Google Sheets connector" \
  --source workflows/webperf-audit.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

### Wasm news

```sh
gcloud workflows deploy wasm-news \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Search several APIs for news about WebAssembly topics and store them in Google Sheets" \
  --source workflows/wasm-news.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

## Trigger a workflow on a recurring schedule

Deploy the workflow first, then create a [Cloud Scheduler job](../docs/cloud-scheduler.md).

## List the workflows

```sh
gcloud workflows list --location $WORKFLOW_LOCATION
```

## Delete a workflow

```sh
gcloud workflows delete random-cocktail --location $WORKFLOW_LOCATION
```

## `execute` vs `run`

Use `gcloud workflows execute` to execute a workflow without waiting for it to complete.

```sh
gcloud workflows execute random-cocktail --location $WORKFLOW_LOCATION
```

Use `gcloud workflows run` to execute a workflow and wait for it to complete.

```sh
gcloud workflows run random-cocktail \
  --location $WORKFLOW_LOCATION \
  --format='value(result)'
```

```sh
gcloud workflows run webperf-audit \
  --location $WORKFLOW_LOCATION
```

```sh
gcloud workflows run webperf-audit \
  --location $WORKFLOW_LOCATION \
  --data '{
    "is_audit_private": 0
  }'
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

You can find the list of available [Compute Engine images](https://cloud.google.com/compute/docs/images) with this command:

```sh
gcloud compute images list
```

### Publish message to PubSub topic

```sh
gcloud pubsub topics publish weather-data \
  --message '{
    "sensorId": "sensor-xyz",
    "zipcode": 55049,
    "temperature": 98.5,
    "timecollected": "2022-08-15 15:29:35",
    "latitude": 43.8657,
    "longitude": 10.2513,
    "humidity": 1.23,
    "dewpoint": 4.56,
    "pressure": 7.89
  }'
```