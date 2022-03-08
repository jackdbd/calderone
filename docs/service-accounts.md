# Service accounts

See [Service Accounts predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#service-accounts-roles).

## Create service accounts

### sa-firestore-user-test

Service account that I use in [firestore-utils](../packages/firestore-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-firestore-user-test \
  --display-name "SA Firestore User test" \
  --description "SA that I use in firestore-utils tests" \
  --project $GCP_PROJECT_ID
```

### sa-firestore-viewer-test

Service account that I use in [firestore-utils](../packages/firestore-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-firestore-viewer-test \
  --display-name "SA Firestore Viewer test" \
  --description "SA that I use in firestore-utils tests" \
  --project $GCP_PROJECT_ID
```

### sa-secret-manager-admin-test

Service account that I use in [secret-manager-utils](../packages/secret-manager-utils/README.md) tests.

Create the service account

```sh
gcloud iam service-accounts create sa-secret-manager-admin-test \
  --display-name "SA Secret Manager Admin test" \
  --description "SA that I use in secret-manager-utils tests" \
  --project $GCP_PROJECT_ID
```

## Download service account credentials

Go to the [service account dashboard](https://console.cloud.google.com/iam-admin/serviceaccounts?project=prj-kitchen-sink), create a new JSON key, download it and store it in `secrets/`. Do **not** track this file in git.

Also, store the content of the JSON file in Secret Manager.

## List service accounts

list all user's defined service accounts:

```sh
gcloud iam service-accounts list --project $GCP_PROJECT_ID
```

## Details about a service account

```sh
gcloud iam service-accounts describe sa-secret-manager-admin-test@prj-kitchen-sink.iam.gserviceaccount.com
```
