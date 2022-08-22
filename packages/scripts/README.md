# @jackdbd/scripts

Scripts useful in development.

## Run the scripts with tsm

No need to build the scripts. Just run them with [tsm](https://github.com/lukeed/tsm).

```sh
npx tsm packages/scripts/src/cloud-billing/list-billing-accounts.ts
```

```sh
npx tsm packages/scripts/src/cloud-monitoring/list-metric-descriptors.ts

npx tsm packages/scripts/src/cloud-monitoring/list-monitored-resources.ts

npx tsm packages/scripts/src/cloud-monitoring/list-uptime-checks.ts

npx tsm packages/scripts/src/cloud-monitoring/time-series.ts
```

```sh
npx tsm packages/scripts/src/cloud-scheduler/schedule-job.ts
```

```sh
npx tsm packages/scripts/src/cloud-tasks/list-tasks-in-queue.ts
```

```sh
npx tsm packages/scripts/src/demo/tags-logger.ts
```

```sh
npx tsm packages/scripts/src/misc/example-sheets.ts
```

```sh
npx tsm packages/scripts/src/pubsub/create-topic.ts --add-dead-letter-topic
npx tsm packages/scripts/src/pubsub/create-subscription.ts
npx tsm packages/scripts/src/pubsub/publish-message.ts
```

```sh
npx tsm packages/scripts/src/secret-manager/destroy-all-versions-of-secret.ts
```
