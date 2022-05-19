# Cloud Billing

Useful links:

- [Cloud Billing predefined IAM roles](https://cloud.google.com/billing/docs/how-to/billing-access)
- [Create, edit, or delete budgets and budget alerts](https://cloud.google.com/billing/docs/how-to/budgets)
- [Cloud Billing Budget API](https://cloud.google.com/billing/docs/reference/budget/rest)
- [Export Cloud Billing data to BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery)
- [Customize budget alert email recipients](https://cloud.google.com/billing/docs/how-to/budgets-notification-recipients)
- [gcloud billing budgets create](https://cloud.google.com/sdk/gcloud/reference/billing/budgets/create)

## Create a billing account and link it to the GCP project

Enable the [Cloud Billing API](https://cloud.google.com/billing/docs/reference/rest):

```sh
gcloud services enable cloudbilling.googleapis.com --project $GCP_PROJECT_ID
```

If this is the first GCP project of your GCP Organization, [create a new billing account](https://cloud.google.com/billing/docs/how-to/manage-billing-account#create_a_new_billing_account).

Retrieve the billing account ID:

```sh
gcloud beta billing accounts list
```

Link the GCP project to the billing account:

```sh
gcloud beta billing projects link $GCP_PROJECT_ID \
  --billing-account $BILLING_ACCOUNT_ID
```

Double check that the GCP project is linked to the billing account, and that billing is enabled for the project:

```sh
gcloud beta billing projects list \
  --billing-account $BILLING_ACCOUNT_ID
```

## Create a billing budget (budget alert)

Enable the [Cloud Billing Budget API](https://cloud.google.com/billing/docs/reference/budget/rest):

```sh
gcloud services enable billingbudgets.googleapis.com --project $GCP_PROJECT_ID
```

```sh
gcloud beta billing budgets list \
  --billing-account $BILLING_ACCOUNT_ID
```
