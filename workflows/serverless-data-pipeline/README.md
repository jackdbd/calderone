# Serverless data pipeline

Variation of the codelab [Building a Serverless Data Pipeline: IoT to Analytics](https://codelabs.developers.google.com/codelabs/iot-data-pipeline).

```sh
gcloud workflows deploy serverless-data-pipeline \
  --project $GCP_PROJECT_ID \
  --location $WORKFLOW_LOCATION \
  --description "Serverless data pipeline (variation of the codelab 'Building a Serverless Data Pipeline: IoT to Analytics')" \
  --source workflows/serverless-data-pipeline/main.yaml \
  --service-account $SA_WORKFLOWS_RUNNER \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=workflow
```