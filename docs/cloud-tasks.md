# Cloud Tasks

Useful links:

- [Cloud Tasks predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#cloud-tasks-roles)

## Queues

List all the available locations where to create task queues

```sh
gcloud tasks locations list --project $GCP_PROJECT_ID
```

Create a task queue

```sh
gcloud tasks queues create $CLOUD_TASKS_QUEUE_ID \
  --project $GCP_PROJECT_ID \
  --location $CLOUD_TASKS_QUEUE_LOCATION
```

List all tasks queues available in this project

```sh
gcloud tasks queues list \
  --project $GCP_PROJECT_ID \
  --location $CLOUD_TASKS_QUEUE_LOCATION
```

Details about a given task queue

```sh
gcloud tasks queues describe $CLOUD_TASKS_QUEUE_ID \
  --project $GCP_PROJECT_ID \
  --location $CLOUD_TASKS_QUEUE_LOCATION
```

## Tasks

Create a HTTP task

```sh
gcloud tasks create-http-task \
  --queue $CLOUD_TASKS_QUEUE_ID \
  --url $SEND_TELEGRAM_MESSAGE_TRIGGER_URL \
  --method 'POST' \
  --header "Content-Type: application/json; charset=utf-8" \
  --body-content '{"text": "Hello from Cloud Tasks"}' \
  --oidc-service-account-email $SA_NOTIFIER \
  --schedule-time "2022-01-31T23:59:00.000Z"
  --project $GCP_PROJECT_ID
```

List the tasks currently in the given queue

```sh
gcloud tasks list --queue $CLOUD_TASKS_QUEUE_ID \
  --project $GCP_PROJECT_ID \
  --location $CLOUD_TASKS_QUEUE_LOCATION
```

Details about a given task in the queue

```sh
gcloud tasks describe SOME_TASK_NUMBER --queue $CLOUD_TASKS_QUEUE_ID \
  --project $GCP_PROJECT_ID \
  --location $CLOUD_TASKS_QUEUE_LOCATION
```

Force a task to run now

```sh
gcloud tasks run SOME_TASK_NUMBER --queue $CLOUD_TASKS_QUEUE_ID \
  --project $GCP_PROJECT_ID \
  --location $CLOUD_TASKS_QUEUE_LOCATION
```
