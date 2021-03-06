## API Report File for "@jackdbd/cloud-scheduler-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { CloudSchedulerClient } from '@google-cloud/scheduler';
import type { protos } from '@google-cloud/scheduler';

// Warning: (ae-forgotten-export) The symbol "HttpJobConfig" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "createHttpJob" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const createHttpJob: ({ cloud_scheduler, description, location_id, name, project_id, req_body, schedule, service_account_email, timezone, url_to_call }: HttpJobConfig) => Promise<protos.google.cloud.scheduler.v1.IJob>;

// Warning: (ae-forgotten-export) The symbol "Config" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "deleteAllJobs" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const deleteAllJobs: ({ cloud_scheduler, location_id, project_id }: Config) => Promise<void>;

// Warning: (ae-forgotten-export) The symbol "DeleteJobConfig" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "deleteJob" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const deleteJob: ({ cloud_scheduler, location_id, name, project_id }: DeleteJobConfig) => Promise<void>;

// Warning: (ae-forgotten-export) The symbol "Config" needs to be exported by the entry point index.d.ts
// Warning: (ae-missing-release-tag) "randomSchedule" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const randomSchedule: (config?: Config_2) => string;

// (No @packageDocumentation comment for this package)

```
