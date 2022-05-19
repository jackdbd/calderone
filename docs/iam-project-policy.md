# IAM policies

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

## Set IAM policy for the GCP project

Retrieve the current IAM policy for the GCP project:

```sh
gcloud projects get-iam-policy $GCP_PROJECT_ID
```

Set the IAM policy for the entire GCP project:

```sh
gcloud projects set-iam-policy $GCP_PROJECT_ID ./iam-policies/project.yaml
```

*Note*: re-setting the policy is **not** an idempotent operation, because the Policy `etag` changes even if the policy itself didn't change.
