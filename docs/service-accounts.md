# Service accounts

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

See [Service Accounts predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#service-accounts-roles).

## Create service accounts

Create a service account that can push to Artifact Registry.

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

### sa-secret-manager-admin-test

Service account that I use in [secret-manager-utils](../packages/secret-manager-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-secret-manager-admin-test \
  --display-name "SA Secret Manager Admin test" \
  --description "SA that I use in secret-manager-utils tests"
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
