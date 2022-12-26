# Eventarc

Useful links:

- [Eventarc predefined IAM roles](https://cloud.google.com/eventarc/docs/access-control)
- [Eventarc events for Workflow Executions](https://cloud.google.com/eventarc/docs/reference/supported-events#workflow-executions)
- [crontab guru](https://crontab.guru/#*_*_*_*)

List all Eventarc triggers

```sh
gcloud eventarc triggers list
```

```sh
gcloud eventarc triggers create workflow-execution-created-in-milan \
--location=europe-west8 \
--service-account=sa-workflows-runner@prj-kitchen-sink.iam.gserviceaccount.com \
--destination-workflow=phantombuster-fetch-result \
--destination-workflow-location=europe-west8 \
--event-filters="type=google.cloud.audit.log.v1.written" \
--event-filters="serviceName=workflowexecutions.googleapis.com" \
--event-filters="methodName=google.cloud.workflows.executions.v1.Executions.CreateExecution"
```
