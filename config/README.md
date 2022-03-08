# config

Config files for building, testing, linting, formatting all packages in this monorepo.

- `commitlint.cjs`: configuration file for [commitlint](https://github.com/conventional-changelog/commitlint), to enforce [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).
- `jest.cjs`: single configuration file for all `*.test.mjs` files. Use it with Jest [experimental support for ECMAScript Modules (ESM)](https://jestjs.io/docs/ecmascript-modules).
- `prettier.cjs`: single configuration file for the code formatter.
- `tsconfig.base.json`: common configuration for tsc. All other tsc configuration files **extend** this file.
- `tsconfig.nodejs-libjson`: tsc configuration for Node.js **libraries**.
- `tsconfig.nodejs-app.json`: tsc configuration for Node.js **applications** (e.g. a serverless function deployed to Cloud Functions, a service deployed to Cloud Run).
