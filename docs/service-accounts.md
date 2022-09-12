# Service accounts

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

See [Service Accounts predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#service-accounts-roles).

## Create service accounts

### sa-artifact-registry-writer

Create a service account that can publish to Artifact Registry.

```sh
gcloud iam service-accounts create sa-artifact-registry-writer \
  --display-name "artifact-registry-writer SA"
```

### sa-compute-engine

Create a service account to attach to all Compute Engine VMs.

```sh
gcloud iam service-accounts create sa-compute-engine \
  --display-name "Compute Engine SA"
```

### sa-dash-earthquakes

Create a service account for the [dash-earthquakes](https://github.com/jackdbd/dash-earthquakes) application. That application will be deployed as a Cloud Run service, and will have attached this service account.

```sh
gcloud iam service-accounts create sa-dash-earthquakes \
  --display-name "dash-earthquakes SA"
```

### sa-dataflow-worker

Create a service account to run [Dataflow](https://cloud.google.com/dataflow/docs) jobs:

```sh
gcloud iam service-accounts create sa-dataflow-worker \
  --display-name "SA Dataflow worker"
```

### sa-firestore-user-test

Service account that I use in [firestore-utils](../packages/firestore-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-firestore-user-test \
  --display-name "SA Firestore User test" \
  --description "SA that I use in firestore-utils tests"
```

### sa-firestore-viewer-test

Service account that I use in [firestore-utils](../packages/firestore-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-firestore-viewer-test \
  --display-name "SA Firestore Viewer test" \
  --description "SA that I use in firestore-utils tests"
```

### sa-github-workflows

Create a service account to use in GitHub Workflows. It can read packages hosted on my private npm repository on Artifact Registry, and it can submit builds to Cloud Build.

```sh
gcloud iam service-accounts create sa-github-workflows \
  --display-name "GitHub Workflows SA"
```

### sa-monitoring

Create a service account for [Cloud Monitoring](https://cloud.google.com/monitoring/access-control).

```sh
gcloud iam service-accounts create sa-monitoring \
  --display-name "Monitoring SA"
```

### sa-pubsub

Create a service account for [Cloud Pub/Sub](https://cloud.google.com/pubsub/docs/access-control).

```sh
gcloud iam service-accounts create sa-pubsub \
  --display-name "Pub/Sub SA"
```

### sa-secret-manager-admin-test

Service account that I use in [secret-manager-utils](../packages/secret-manager-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-secret-manager-admin-test \
  --display-name "SA Secret Manager Admin test" \
  --description "SA that I use in secret-manager-utils tests"
```

### sa-storage-uploader

Create a service account to upload objects to Cloud Storage. See [here](https://cloud.google.com/storage/docs/access-control/iam-roles) for the predefined IAM roles.

```sh
gcloud iam service-accounts create sa-storage-uploader \
  --display-name "Storage uploader SA"
```

### sa-telegram-bot

Create a service account for the [@jackdbd/telegram-bot](../packages/telegram-bot/README.md) application. That application will be deployed as a Cloud Run service, and will have attached this service account.

```sh
gcloud iam service-accounts create sa-telegram-bot \
  --display-name "SA Telegram bot" \
  --description "SA for the @jackdbd/telegram-bot application"
```

### sa-webhooks

Create a service account for the [@jackdbd/webhooks](../packages/webhooks/README.md) application. That application will be deployed as a Cloud Run service, and will have attached this service account.

```sh
gcloud iam service-accounts create sa-webhooks \
  --display-name "SA Webhooks" \
  --description "SA for the @jackdbd/webhooks application"
```

## Download service account credentials

Go to the [service account dashboard](https://console.cloud.google.com/iam-admin/serviceaccounts?project=prj-kitchen-sink), create a new JSON key, download it and store it in `secrets/`. Do **not** track this file in git.

Also, store the content of the JSON file in Secret Manager.

## List service accounts

list all user's defined service accounts:

```sh
gcloud iam service-accounts list
```

## Details about a service account

```sh
gcloud iam service-accounts describe sa-secret-manager-admin-test@prj-kitchen-sink.iam.gserviceaccount.com
```

## Grant service account impersonation to a user account

Here is how you can grant a user account the ability to perform service account impersonation on **all** service accounts in a GCP project:

```sh
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member=user:giacomo@giacomodebidda.com \
  --role=roles/iam.serviceAccountUser

gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member=user:giacomo@giacomodebidda.com \
  --role=roles/iam.serviceAccountTokenCreator
```
