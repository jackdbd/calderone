# @jackdbd/cloud-scheduler-utils

[![npm version](https://badge.fury.io/js/@jackdbd%2Fcloud-scheduler-utils.svg)](https://badge.fury.io/js/@jackdbd%2Fcloud-scheduler-utils)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fcloud-scheduler-utils)

Utility functions to work with [Cloud Sheduler](https://cloud.google.com/scheduler).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [Why?](#why)
- [API](#api)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/cloud-scheduler-utils
```

> ⚠️ **Warning:**
> 
> This library declares [@google-cloud/scheduler](https://www.npmjs.com/package/@google-cloud/scheduler) and [debug](https://www.npmjs.com/package/debug) as peer dependencies.


## Why?

I find the Cloud Scheduler client a bit awkward to work with, so I decided to make a tiny set of utilities for my needs.

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/cloud-scheduler-utils/)

## Usage

```js
import { CloudSchedulerClient } from '@google-cloud/scheduler'
import { createHttpJob, deleteJob, randomSchedule } from '@jackdbd/cloud-scheduler-utils'

// Instantiate your Cloud Scheduler client as you prefer:
// - Application Default Credentials (ADC)
// - environment variable GOOGLE_APPLICATION_CREDENTIALS
// - JSON key of a service account
const cloud_scheduler = new CloudSchedulerClient()

// Spaces are not possible, apostrophes are not possible (e.g. `new year's eve` is not a valid job name)
const name = 'call-google-on-a-schedule'

const location_id = 'europe-west3'

// Set a fixed schedule...
const schedule = '59 23 31 12 *' // Tip: use https://crontab.guru/
// ...or a random one:
// const schedule = randomSchedule()

const config = {
  cloud_scheduler, // Notice you have to pass your Cloud Scheduler client as configuration for the job.
  description: 'this is a test HTTP job',
  location_id,
  name,
  project_id: '<YOUR GOOGLE CLOUD PLATFORM PROJECT ID>',
  schedule,
  service_account_email: '<YOUR SERVICE ACCOUNT EMAIL>',
  timezone: 'Europe/Rome',
  url_to_call: 'https://www.google.com/'
}

const job = await createHttpJob(config)

await deleteJob({ cloud_scheduler, location_id, name })

await deleteAllJobs({ cloud_scheduler, location_id, name })
```