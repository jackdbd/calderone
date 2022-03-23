# Calderone

![CI workflow](https://github.com/jackdbd/calderone/actions/workflows/ci.yaml/badge.svg) [![codecov](https://codecov.io/gh/jackdbd/calderone/branch/main/graph/badge.svg)](https://codecov.io/gh/jackdbd/calderone) [![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/calderone/badge)](https://www.codefactor.io/repository/github/jackdbd/calderone)

Monorepo that I use for a bunch of stuff, managed with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) (requires npm 7.x or later).

## Installation

Clone the repo:

```shell
git clone git@github.com:jackdbd/calderone.git

cd calderone
```

Refresh the access tokens for all npm registries. This is required because I host some npm packages on a private npm repository on Artifact Registry (the OAuth 2.0 access token required to access GCP Artifact Registry is [valid for one hour](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials#sa-credentials-oauth), but its lifetime can be extended [up to 12 hours](https://stackoverflow.com/a/69712755/3036129)).

```sh
npx google-artifactregistry-auth --repo-config .npmrc --credential-config ~/.npmrc
```

Install all dependencies from npm.js and Artifact Registry and setup git hooks with [husky](https://typicode.github.io/husky/):

```sh
npm install
```

## Build

Build all libraries (to `lib`) and scripts (to `dist`):

```sh
npm run build:libs
npm run build:scripts
```

Build all libraries in watch mode:

```sh
npm run build:libs:watch
```

## Applications

- [@jackdbd/webhooks](./packages/webhooks/README.md): Application that receives webhook events from several third parties and handles them.
