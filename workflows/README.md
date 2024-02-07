# Google Cloud Workflows

Useful links:

- [Cloud Workflows predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#workflows-roles)

## Workflows

- [Hacker News](./hacker-news/README.md)
- [Human-in-the-loop](./human-in-the-loop/README.md)
- [Random cocktail](./random-cocktail/README.md)
- [Reddit](./reddit/README.md)
- [Serverless data pipeline](./serverless-data-pipeline/README.md)

If you don't want to specify `--location` in every command, ensure that you specify it in the `[workflows]` section of your gcloud config configuration. For example:

```toml
[core]
account = giacomo@giacomodebidda.com
project = prj-kitchen-sink
verbosity = warning

[workflows]
location = europe-west4
```

## Deploy a Workflow to GCP

All of the following commands are meant to be executed from the monorepo root. The environment variable `WORKFLOW_LOCATION` is set to `europe-west4`. The environment variable `SA_WORKFLOWS_RUNNER` is the service account attached to each GCP Workflow.

```sh
gcloud workflows deploy create-stop-delete-vm \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Create, start, stop, delete a VM using the Compute Engine Workflows Connector" \
  --source workflows/create-stop-delete-vm.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

### PhantomBuster LinkedIn search (launch agent)

```sh
gcloud workflows deploy phantombuster-linkedin-search \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Perform a LinkedIn search with PhantomBuster" \
  --source workflows/phantombuster-linkedin-search.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```

### PhantomBuster results (fetch results from container)

```sh
gcloud workflows deploy phantombuster-fetch-result \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Fetch results from PhantomBuster" \
  --source workflows/phantombuster-fetch-result.yaml \
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
gcloud workflows list --location "${WORKFLOW_LOCATION}"
```

## `execute` vs `run`

Use `gcloud workflows execute` to execute a workflow without waiting for it to complete.

Use `gcloud workflows run` to execute a workflow and wait for it to complete.

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

```sh
gcloud workflows run phantombuster-linkedin-search \
  --location $WORKFLOW_LOCATION \
  --format 'value(result)' | jq
```

```sh
gcloud workflows run human-in-the-loop \
  --location $WORKFLOW_LOCATION
```

### If the workflow requires input data

A workflow requires input data if it has:

```yaml
main:
  params: [args]
```

For example:

```sh
gcloud workflows run phantombuster-fetch-result \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --data '{
    "containerId": "811777507381323"
  }' \
  --format 'value(result)' | jq
```

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
