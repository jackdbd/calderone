# Calderone

![CI workflow](https://github.com/jackdbd/calderone/actions/workflows/ci.yaml/badge.svg)
![Release to npmjs.com workflow](https://github.com/jackdbd/calderone/actions/workflows/release-to-npmjs.yaml/badge.svg)
[![codecov](https://codecov.io/gh/jackdbd/calderone/branch/main/graph/badge.svg?token=P5uJ3doRer)](https://codecov.io/gh/jackdbd/calderone)
[![CodeFactor](https://www.codefactor.io/repository/github/jackdbd/calderone/badge)](https://www.codefactor.io/repository/github/jackdbd/calderone)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

Monorepo that I use for a bunch of stuff, managed with [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) (requires npm 7.x or later).

![Calderone logo](./assets/images/calderone-logo.png)

> 📦 **ESM only:**
> 
> All libraries of this monorepo are published to npmjs as ECMAScript modules.
>
> At the moment none of these packages has a CommonJS build.

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

> [!NOTE]
> The flag `--include dev` is just to make sure dev dependencies get installed even if you have set the environment variable `NODE_ENV=production` on your machine.

## Build

This monorepo uses [Typescript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) to build all of its libraries.

Documentation is built by [TypeDoc](https://typedoc.org/).

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
npm run build -w packages/telegram-bot
npm run build -w packages/wasm-news
npm run build -w packages/webhooks
```

## Test

Run all tests on all packages:

```sh
npm run test
```

## Documentation

The documentation for all libraries in this monorepo is built by [TypeDoc](https://typedoc.org/).

API docs are built by [api-extractor](https://api-extractor.com/) + [api-documenter](https://api-extractor.com/pages/setup/generating_docs/).

Whenever there are changes to a library, rebuild its documentation to see if the public API was changed.

For example, let's say that we made some changes to the [checks](./packages/checks/README.md) package.

First, rebuild the library and its documentation:

```sh
npm run build -w packages/checks
```

> :warning: **Warning:**
>
> If you changed the public API of the library (e.g. the doctring of the `isEuropeanVat()` function no longer declares the function as `@public`, but now declares it as `@internal`) API Extractor will print a warning and the build script will fail. Follow the instructions API Extractor gives you and re-run the build script, which this time should pass.

Second, spin up a dev server and double-check the documentation generated for the library:

```sh
npx http-server --port 8080 -o docs/checks
```

*Note*: if the documentation was generated but you don't see it in the browser, open DevTools and click on `Empty Cache and Hard Reload`.

Third, commit the changes, either with a single commit:

```sh
git add packages/checks
git add docs/checks
git commit -m 'feat(checks): add function foo()'
```

or with 2 commits:

```sh
# source code
git add packages/checks/src
git commit -m 'feat(checks): add function foo()'
```

```sh
# docs
git add packages/checks/.ae
git add packages/checks/api-docs
git add docs/checks
git commit -m 'docs(checks): rebuild docs'
```

## Monorepo management

Keep the npm packages up to date using [taze](https://github.com/antfu-collective/taze):

```sh
npx taze
```

See also:

- [docs](./docs/README.md)
- [scripts](./scripts/README.md)

## Applications

- [@jackdbd/send-telegram-message](./packages/send-telegram-message/README.md): application that sends a message to a Telegram chat.
- [@jackdbd/telegram-bot](./packages/telegram-bot/README.md): Telegram bot that I use for several things.
- [@jackdbd/wasm-news](./packages/wasm-news/README.md): application that retrieves news about webassembly from several APIs (Reddit, Twitter, etc) and populates [this Google Sheets worksheet](https://docs.google.com/spreadsheets/d/1_px1dEv87iuDTTG6f6QfeSdNrGUhIsb941KDQwTOGLc).
- [@jackdbd/webhooks](./packages/webhooks/README.md): application that receives webhook events from several third parties and handles them.
