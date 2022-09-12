# @jackdbd/pkg-cloud-run-job-example

Example that shows how to create a Node.js executable with [pkg](https://github.com/vercel/pkg) and to deploy it to [Cloud Run Jobs](https://cloud.google.com/run/docs/create-jobs).

## Development

```sh
npm run start:development -w packages/pkg-cloud-run-job-example
```

## Test

Run integration tests with [SuperTest](https://github.com/visionmedia/supertest) and Jest:

```sh
npm run test -w packages/pkg-cloud-run-job-example
```

## Executable

Create an executable with pkg:

```sh
npm run exe:build -w packages/pkg-cloud-run-job-example
```

Run the executable:

```sh
npm run exe:start:development -w packages/pkg-cloud-run-job-example
```

Create a container image containing the executable:

```sh
npm run container:build -w packages/pkg-cloud-run-job-example
```

Run the container:

```sh
npm run container:start:development -w packages/pkg-cloud-run-job-example
# or
npm run container:start:production -w packages/pkg-cloud-run-job-example
```

## Deploy

Deploy the containerized application to Cloud Run Jobs.

```sh
npm run deploy -w packages/pkg-cloud-run-job-example
```

## Execute the Cloud Run job

Executing a Cloud Run job means creating a Cloud Run job **execution**.

Invoke the Cloud Run job using the currently authenticated **user account**.

```sh
gcloud beta run jobs execute pkg-cloud-run-job-example \
  --region europe-west3 \
  --verbosity info
```

Invoke the Cloud Run job using a **service account** (thanks to service account impersonation):

```sh
gcloud beta run jobs execute pkg-cloud-run-job-example \
  --region europe-west3 \
  --impersonate-service-account "sa-workflows-runner@prj-kitchen-sink.iam.gserviceaccount.com" \
  --verbosity info
```
