# Calderone

Monorepo that I use for a bunch of stuff, managed with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) (requires npm 7.x or later).

## Installation

Clone the repo:

```shell
git clone git@github.com:jackdbd/calderone.git

cd calderone
```

Authenticate to GCP in order to download the packages I host on Artifact Registry. The OAuth 2.0 access token is [valid for one hour](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials#sa-credentials-oauth) (even its lifetime can be extended [up to 12 hours](https://stackoverflow.com/a/69712755/3036129)).

```sh
npx google-artifactregistry-auth --repo-config .npmrc
```

Install all dependencies from npm.js and Artifact Registry (thanks to the `.npmrc`) and setup git hooks with [husky](https://typicode.github.io/husky/):

```sh
npm install
```

## Build

Build all packages (libraries to `lib`, applications and scripts to `dist`):

```sh
# all at once
npm run build

# or individually
npm run build/libs
npm run build/scripts
npm run build/apps/prod
```

Build all libraries in watch mode:

```sh
npm run build/libs/watch
```
