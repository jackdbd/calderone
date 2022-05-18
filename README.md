# Calderone

![CI workflow](https://github.com/jackdbd/calderone/actions/workflows/ci.yaml/badge.svg) [![codecov](https://codecov.io/gh/jackdbd/calderone/branch/main/graph/badge.svg)](https://codecov.io/gh/jackdbd/calderone) [![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/calderone/badge)](https://www.codefactor.io/repository/github/jackdbd/calderone)

Monorepo that I use for a bunch of stuff, managed with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) (requires npm 7.x or later).

## Installation

Clone the repo:

```shell
git clone git@github.com:jackdbd/calderone.git

cd calderone
```

Refresh the access tokens for all npm registries. This is required because I host some npm packages on a private npm repository on Artifact Registry. The OAuth 2.0 access token required to access GCP Artifact Registry is [valid for one hour](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials#sa-credentials-oauth) (even if its lifetime can be extended [up to 12 hours](https://stackoverflow.com/a/69712755/3036129)).

The [project-config](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc#per-project-config-file) `.npmrc` is tracked in this repository. The [user-config](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc#per-user-config-file) `.npmrc` is not tracked in git because it contains the access tokens.

```sh
npx google-artifactregistry-auth --repo-config .npmrc --credential-config ~/.npmrc
```

Install all dependencies from npm.js and Artifact Registry and setup git hooks with [husky](https://typicode.github.io/husky/):

```sh
npm install --include dev
```

Note: `--include dev` is just to be sure that dev dependencies gets installed even if you have set the environment variable `NODE_ENV=production` on your machine.

## Build

This monorepo uses [Typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to build all of its libraries.

Build all libraries (to `lib`):

```sh
npm run build:libs
```

Build all libraries in watch mode:

```sh
npm run build:libs:watch
```

Build all scripts (to `dist`):

```sh
npm run build:scripts
```

Build all scripts in watch mode and all libraries in watch mode (useful for developing new scripts in TypeScript):

```sh
npm dev:scripts
```

Build all applications:

```sh
npm run build -w packages/audit
npm run build -w packages/telegram-bot
npm run build -w packages/wasm-news
npm run build -w packages/webhooks
```

## Test

Run all tests on all packages:

```sh
npm run test
```

## Miscellaneous

Lint all packages with eslint:

```sh
npm run lint
```

Format all packages with prettier:

```sh
npm run format
```

## Applications

- [@jackdbd/audit](./packages/audit/README.md): application that retrieves records from [this Google Sheet](https://docs.google.com/spreadsheets/d/12Z3HBsRuuJp8yXTa9uaK2CzY6so_uIOrRGa8kaq8ZPk/edit#gid=0) and schedules web performance audits with [WebPageTest](https://docs.webpagetest.org/api/reference) using Google Cloud [Workflows](https://console.cloud.google.com/workflows?project=prj-kitchen-sink).
- [@jackdbd/telegram-bot](./packages/telegram-bot/README.md): Telegram bot that I use for several things.
- [@jackdbd/wasm-news](./packages/wasm-news/README.md): application that retrieves news about webassembly from several APIs (Reddit, Twitter, etc) and populates [this Google Sheets worksheet](https://docs.google.com/spreadsheets/d/1_px1dEv87iuDTTG6f6QfeSdNrGUhIsb941KDQwTOGLc).
- [@jackdbd/webhooks](./packages/webhooks/README.md): application that receives webhook events from several third parties and handles them.


```sh
npm run cloudbuild -w packages/checks
```