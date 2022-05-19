# Setup for Secret Manager

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

Useful links:

- [Secret Manager predefined IAM roles](https://cloud.google.com/secret-manager/docs/access-control)

## Create secrets

Assigning a value to a secret is [discouraged from the shell](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#add-secret-version). It's better to create the secret with gcloud but assigning secret versions using the web UI.

```sh
gcloud secrets create GITHUB_TOKEN \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

```sh
gcloud secrets create NETLIFY \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

```sh
gcloud secrets create SENDGRID \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

```sh
gcloud secrets create TELEGRAM \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

```sh
gcloud secrets create TEST_SECRET \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=secret
```

## List secrets

```sh
gcloud secrets list --project $GCP_PROJECT_ID
```

## List versions of a secret

List all `ENABLED` versions of the secret `TEST_SECRET`

```sh
gcloud secrets versions list TEST_SECRET \
  --filter state:ENABLED
```

List all `DESTROYED` versions of the secret `TEST_SECRET`

```sh
gcloud secrets versions list TEST_SECRET \
  --filter state:DESTROYED
```
