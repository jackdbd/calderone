# scripts

Scripts for building, testing, deploying the packages of this monorepo, or for general development.

## create a new package in this monorepo

Create a new package in this monorepo using [these templates](../assets/templates/README.md) and answering the questions this script asks you.

```sh
# run this from the monorepo root
./scripts/new-package.mjs
```

## publish a package to Artifact Registry

Each package is published to my private Artifact Registry automatically, when pull requests get merged into the `main` branch, thanks to the [release.yaml](../.github/workflows/release.yaml) GitHub workflow. The `release.yaml` workflow does **not** publish the package to npmjs.

If the workflow should not work, you can also publish a package using this script:

```sh
# run this from the monorepo root
./scripts/publish/artifact-registry.mjs --package PACKAGE_NAME
```

> :information_source: **Note:**
> 
> :question: The script asks for confirmation right before publishing each package to Artifact Registry.
> 
> :exclamation: The script does **not** publish the package to npmjs.

## publish a package to npmjs

The [@semantic-release/npm](https://github.com/semantic-release/npm) plugin does not support publishing to multiple npm registries for [good reasons](https://github.com/semantic-release/npm/issues/69#issuecomment-391114128). Since I want to publish **all** of my npm package to my private Artifact Registry and **some** of these packages to npmjs, this is what I do:

1. download a npm package **previously published** to my private npm repository on Artifact Registry,
2. republish the npm package to npmjs (without altering it of course).

I created a [script](./publish/npm.mjs) to do just that.

You can run the `publish/npm.mjs` script multiple times, one for each library of this monorepo, using the following command:

```sh
# run this from the monorepo root
npm run publish:npm
```

> :information_source: **Note:**
> 
> :question: The script asks for confirmation right before publishing each package to npmjs.
>
> :point_right: By default, the script publishes to npmjs the `latest` version of the same package that it found on my private Artifact Registry. If you want to publish to npmjs a specific version of a package (e.g. `1.2.3`), add `--version 1.2.3` to the `publish:npm` script of **that** package.
