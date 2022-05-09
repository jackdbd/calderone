# @jackdbd/scripts

Scripts useful in development.

## Development

When developing new scripts or modifying existing ones it's useful to compile all libraries and scripts in watch mode with esbuild.

This command uses [run-p](https://github.com/mysticatea/npm-run-all/blob/master/docs/run-p.md) to compile all libraries and scripts in [esbuild watch mode](https://esbuild.github.io/api/#watch):

```sh
# from the monorepo root
npm run dev:scripts
```

Then launch the script in another terminal window. For example:

```sh
# from the monorepo root
node packages/scripts/dist/cloud-scheduler/example.js

node packages/scripts/dist/cloud-tasks/example.js

node packages/scripts/dist/misc/container-scan.js

node packages/scripts/dist/pubsub/create-subscription.js
```
