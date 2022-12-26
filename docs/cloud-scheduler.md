# Cloud Scheduler

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

Useful links:

- [Cloud Scheduler predefined IAM roles](https://cloud.google.com/iam/docs/understanding-roles#cloud-scheduler-roles)
- [crontab guru](https://crontab.guru/#*_*_*_*)

## Locations

List available locations where to create and run jobs

```sh
gcloud scheduler locations list
```

## Jobs

Create a job that requires an OIDC token

```sh
gcloud scheduler jobs create http daily-message \
  --location "europe-west3" \
  --schedule "55 10 * * *" \
  --uri "$SEND_TELEGRAM_MESSAGE_TRIGGER_URL" \
  --http-method POST \
  --description "send a message to Telegram (Cloud Functions)" \
  --time-zone "Europe/Rome" \
  --attempt-deadline 1m30s \
  --headers "Content-Type=application/json; charset=utf-8,User-Agent=Google-Cloud-Scheduler" \
  --oidc-service-account-email $SA_NOTIFIER \
  --message-body '{
    "text": "Hello from the Cloud Scheduler job daily-message"
  }'
```

```sh
gcloud scheduler jobs create http weekly-linkedin-search \
  --location "europe-west3" \
  --schedule "30 19 * * 2" \
  --uri "$WORKFLOW_URL_LINKEDIN_SEARCH" \
  --http-method POST \
  --description "Perform a LinkedIn search using PhantomBuster" \
  --time-zone "Europe/Rome" \
  --attempt-deadline 4m30s \
  --headers "Content-Type=application/json; charset=utf-8,User-Agent=Google-Cloud-Scheduler" \
  --oauth-service-account-email "$SA_WORKFLOWS_RUNNER" \
  --message-body '{}'
```

Create a job that requires an OAuth token

```sh
gcloud scheduler jobs create http daily-cocktail \
  --location "europe-west3" \
  --schedule "00 21 * * *" \
  --uri "$WORKFLOW_URL_RANDOM_COCKTAIL" \
  --http-method POST \
  --description "pick a random cocktail and send it to Telegram (Cloud Workflows + Cloud Functions)" \
  --time-zone "Europe/Rome" \
  --attempt-deadline 30s \
  --headers "Content-Type=application/json; charset=utf-8,User-Agent=Google-Cloud-Scheduler" \
  --oauth-service-account-email "$SA_WORKFLOWS_RUNNER"
```

```sh
gcloud scheduler jobs create http weekly-wasm-news \
  --location 'europe-west3' \
  --schedule '15 21 * * 0' \
  --uri "$WORKFLOW_URL_WASM_NEWS" \
  --http-method POST \
  --description "retrieve news about webassembly from several APIs (GitHub, Reddit, Stack Exchange, Twitter)" \
  --time-zone "Europe/Rome" \
  --attempt-deadline 2m30s \
  --headers "Content-Type=application/json; charset=utf-8,User-Agent=Google-Cloud-Scheduler" \
  --oauth-service-account-email $SA_WASM_NEWS
```

```sh
gcloud scheduler jobs create http weekly-lead-generation \
  --location 'europe-west3' \
  --schedule '15 20 * * 0' \
  --uri "$WORKFLOW_URL_LEAD_GENERATION" \
  --http-method POST \
  --description "run my lead generation workflow" \
  --time-zone "Europe/Rome" \
  --attempt-deadline 1m30s \
  --headers "Content-Type=application/json; charset=utf-8,User-Agent=Google-Cloud-Scheduler" \
  --oauth-service-account-email $SA_WORKFLOWS_RUNNER
```

List jobs defined in a given location

```sh
gcloud scheduler jobs list \
  --location europe-west3
```

Print details about a job

```sh
gcloud scheduler jobs describe daily-cocktail \
  --location europe-west3
```

Run a job

```sh
gcloud scheduler jobs run daily-cocktail \
  --location europe-west3
```

Delete a job

```sh
gcloud scheduler jobs delete daily-cocktail \
  --location europe-west3
```
