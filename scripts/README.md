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
./scripts/publish/artifact-registry.mjs --package UNSCOPED_PACKAGE_NAME
# e.g.
./scripts/publish/artifact-registry.mjs --package utils
```

> :information_source: **Note:**
> 
> :question: The script asks for confirmation right before publishing each package to Artifact Registry.
> 
> :exclamation: The script does **not** publish the package to npmjs.
