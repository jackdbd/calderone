# Hacker News

Search stuff using the [Hacker News Search API](https://hn.algolia.com/api).

## Deploy

Deploy the workflow.

```sh
gcloud workflows deploy hacker-news \
  --project "${GCP_PROJECT_ID}" \
  --description "Retrieve interesting stuff from Hacker News" \
  --source "workflows/hacker-news/main.yaml" \
  --service-account "${SA_WORKFLOWS_RUNNER}" \
  --labels "customer=${CUSTOMER},environment=${ENVIRONMENT},resource=workflow"
```

## Run / Execute

Run the workflow.

```sh
gcloud workflows run hacker-news \
  --format='value(result)' | jq
```

Execute the workflow (return immediately, do not wait for the workflow to complete).

```sh
gcloud workflows execute hacker-news
```

## Delete

Delete the workflow.

```sh
gcloud workflows delete hacker-news
```
