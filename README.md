# Calderone

![CI workflow](https://github.com/jackdbd/calderone/actions/workflows/ci.yaml/badge.svg)
![release-to-npmjs workflow](https://github.com/jackdbd/calderone/actions/workflows/release-to-npmjs.yaml/badge.svg)
[![codecov](https://codecov.io/gh/jackdbd/calderone/branch/main/graph/badge.svg?token=P5uJ3doRer)](https://codecov.io/gh/jackdbd/calderone)
[![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/calderone/badge)](https://www.codefactor.io/repository/github/jackdbd/calderone)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

Monorepo that I use for a bunch of stuff, managed with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) (requires npm 7.x or later).

> 📦 **ESM only:**
> 
> All libraries of this monorepo are published to npmjs as ECMAScript modules.
>
> At the moment no one of these packages has a CommonJS build.

## Installation

Clone the repo:

```shell
git clone git@github.com:jackdbd/calderone.git

cd calderone
```

Install all dependencies from npm.js and setup git hooks with [husky](https://typicode.github.io/husky/):

```sh
npm install --include dev
```

*Note:* `--include dev` is just to be sure that dev dependencies gets installed even if you have set the environment variable `NODE_ENV=production` on your machine.

## Build

This monorepo uses [Typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to build all of its libraries.
Documentation is built bt [TypeDoc](https://typedoc.org/).
API docs are built by [api-extractor](https://api-extractor.com/) + [api-documenter](https://api-extractor.com/pages/setup/generating_docs/).

Build all libraries and their documentation (code to `<package-root>/lib`, TypeDoc docs to `<monorepo-root>/docs`, api-documenter API docs to `<package-root>/api-docs`):

```sh
npm run build
```

Build all libraries, but with no docs (much faster, since building docs takes some time):

```sh
npm run build:libs
```

Build all development scripts in watch mode and all libraries in watch mode (useful for developing new scripts in TypeScript):

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

## Monorepo management

See:

- [docs](./docs/README.md)
- [scripts](./scripts/README.md)

## Applications

- [@jackdbd/audit](./packages/audit/README.md): application that retrieves records from [this Google Sheet](https://docs.google.com/spreadsheets/d/12Z3HBsRuuJp8yXTa9uaK2CzY6so_uIOrRGa8kaq8ZPk/edit#gid=0) and schedules web performance audits with [WebPageTest](https://docs.webpagetest.org/api/reference) using Google Cloud [Workflows](https://console.cloud.google.com/workflows?project=prj-kitchen-sink).
- [@jackdbd/telegram-bot](./packages/telegram-bot/README.md): Telegram bot that I use for several things.
- [@jackdbd/wasm-news](./packages/wasm-news/README.md): application that retrieves news about webassembly from several APIs (Reddit, Twitter, etc) and populates [this Google Sheets worksheet](https://docs.google.com/spreadsheets/d/1_px1dEv87iuDTTG6f6QfeSdNrGUhIsb941KDQwTOGLc).
- [@jackdbd/webhooks](./packages/webhooks/README.md): application that receives webhook events from several third parties and handles them.
