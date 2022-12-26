# Random cocktail

Retrieve a random cockail from [TheCocktailDB](https://www.thecocktaildb.com/) and send it to a Telegram chat.

## Deploy

Deploy the workflow.

```sh
gcloud workflows deploy "random-cocktail" \
  --description "Get a random cocktail from thecocktaildb.com" \
  --source "workflows/random-cocktail/main.yaml" \
  --service-account "${SA_WORKFLOWS_RUNNER}" \
  --labels "customer=${CUSTOMER},environment=${ENVIRONMENT},resource=workflow"
```

## Run / Execute

Run the workflow.

```sh
gcloud workflows run "random-cocktail" \
  --format='value(result)' | jq
```

Execute the workflow (return immediately, do not wait for the workflow to complete).

```sh
gcloud workflows execute "random-cocktail"
```

## Delete

Delete the workflow.

```sh
gcloud workflows delete "random-cocktail"
```
