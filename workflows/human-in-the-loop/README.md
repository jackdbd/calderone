# Human-in-the-loop

## Deploy

Deploy the workflow.

```sh
gcloud workflows deploy human-in-the-loop \
  --description "Human-in-the-loop workflow where the user authorizes execution from a Telegram chat" \
  --source "workflows/human-in-the-loop/main.yaml" \
  --service-account "${SA_WORKFLOWS_RUNNER}" \
  --labels "customer=${CUSTOMER},environment=${ENVIRONMENT},resource=workflow"
```

## Run / Execute

Run the workflow.

```sh
gcloud workflows run human-in-the-loop \
  --format='value(result)' | jq
```

Click the link in the Telegram chat. It will invoke the [human-in-the-loop-authorizer](../packages/human-in-the-loop-authorizer/README.md) function (hosted on Cloud Functions), which will authorize the workflow execution.

## Delete

Delete the workflow.

```sh
gcloud workflows delete human-in-the-loop
```
