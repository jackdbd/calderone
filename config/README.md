# config

Config files for building, testing, linting, formatting all packages in this monorepo.

- `commitlint.cjs`: configuration for [commitlint](https://github.com/conventional-changelog/commitlint), to enforce [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- `eslint.cjs`: configuration for [ESLint](https://eslint.org/).
- `jest.cjs`: configuration for all `*.test.mjs` files. Use it with Jest [experimental support for ECMAScript Modules (ESM)](https://jestjs.io/docs/ecmascript-modules).
- `lint-staged.cjs`: configuration for [lint-staged](https://github.com/okonet/lint-staged).
- `prettier.cjs`: configuration for the [Prettier](https://prettier.io/) (code formatter).
- `semantic-release.cjs`: common configuration for [semantic release](https://github.com/semantic-release/semantic-release) and [multi-semantic-release](https://github.com/qiwi/multi-semantic-release).
- `tsconfig.base.json`: common configuration for tsc. All other tsc configuration files **extend** this file.
- `tsconfig.nodejs-libjson`: tsc configuration for Node.js **libraries**.
- `tsconfig.nodejs-app.json`: tsc configuration for Node.js **applications** (e.g. a serverless function deployed to Cloud Functions, a service deployed to Cloud Run).
