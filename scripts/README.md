# scripts

Scripts for building, testing, deploying the packages of this monorepo, or for general development. Most scripts are written in ESM, thanks to [zx](https://github.com/google/zx).

<!-- GitHub markdown shortcode cheatsheets -->
<!-- https://gist.github.com/rxaviers/7360908 -->
<!-- https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md -->

## create a new package in this monorepo

Create a new npm package in this monorepo using [these templates](../assets/templates/README.md) and answering a few questions.

```sh
# run this from the monorepo root
./scripts/new-package.mjs
```

## publish a package to npmjs

Each npm package is published to my private Artifact Registry automatically, when pull requests get merged into the `main` branch, thanks to [@qiwi/multi-semantic-release](https://github.com/qiwi/multi-semantic-release#readme) invoked in the [release.yaml](../.github/workflows/release.yaml) GitHub workflow.

> :warning: **Warning:**
>
> :heavy_multiplication_x: The `release.yaml` workflow does **not** publish any npm package to npmjs.

Once a package is published to my private Artifact Registry, I publish it to [npmjs](https://www.npmjs.com/settings/jackdbd/packages) using this script:

```sh
# run this from the monorepo root
./scripts/publish/npmjs.mjs
```

> :information_source: **Note:**
> 
> :question: The script asks for confirmation right before publishing **each** package to npmjs.
