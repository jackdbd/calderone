# @jackdbd/human-in-the-loop-authorizer

Application to authorize a human-in-the-loop process using a [Workflows callback](https://cloud.google.com/workflows/docs/creating-callback-endpoints).

## Deploy

This command uploads the source code to Cloud Build, which deploys the application to [Cloud Functions (2nd generation)](https://cloud.google.com/functions/docs/concepts/version-comparison):

```sh
npm run deploy -w packages/human-in-the-loop-authorizer
```

## Test

Run integration tests with [SuperTest](https://github.com/visionmedia/supertest) and Jest:

```sh
npm run test -w packages/human-in-the-loop-authorizer
```

### Test the function locally

In one terminal, watch the function and auto-reload it with [entr](https://github.com/eradman/entr):

```sh
npm run dev -w packages/human-in-the-loop-authorizer
```

In one terminal, call the function with curl or any other HTTP client:

```sh
curl "${AUTHORIZE_CALLBACK_URL_FUNCTION_URL}?callback_url=https://example.com&workflow_id=123&location=europe-west4&execution_id=456" \
  -X GET
```

Test an old, valid callback URL that is no longer registered (i.e. expired):

```sh
curl "${AUTHORIZE_CALLBACK_URL_FUNCTION_URL}?callback_url=https://workflowexecutions.googleapis.com/v1/projects/1051247446620/locations/europe-west4/workflows/human-in-the-loop/executions/58e69890-e933-4b14-8069-2453b3f24ff2/callbacks/54eea355-4a31-4a4e-834f-ce38a5db1636_732adbf2-4063-4875-8dd8-273e47c201a7&workflow_id=human-in-the-loop&location=europe-west4&execution_id=58e69890-e933-4b14-8069-2453b3f24ff2" \
  -X GET
```
  <!-- -H "Content-Type: application/json" -->

### Test the complete human-in-the-loop workflow

First of all, double check that both the workflow [human-in-the-loop](../../workflows/README.md) and this function are deployed and up to date.

Run the `human-in-the-loop` workflow. This will create a workflow create an [execution](https://cloud.google.com/workflows/docs/reference/executions/rest).

```sh
gcloud workflows run human-in-the-loop \
  --location $WORKFLOW_LOCATION \
  --format='value(result)' | jq
```

The workflow execution will now pause and you'll have to authorize it in the Telegram chat.

Upon authorization, you should receive another Telegram message.
