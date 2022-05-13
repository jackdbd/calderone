#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

# download a version of a package previously published to Artifact Registry, and
# publish it to npmjs too.

scope=$1 # e.g. jackdbd
package=$2 # e.g. firestore-utils
version=$3 # e.g. 1.2.3

authToken=$NPM_TOKEN

tmp_dir=$(mktemp -d -t npm-pkg-XXXXXXXXXX)
# echo "temp directory $tmp_dir"

# https://stackoverflow.com/questions/15035786/download-source-from-npm-without-installing-it
npm pack "@$scope/$package@$version" --pack-destination $tmp_dir

cd $tmp_dir
tar -xvf "$scope-$package-$version.tgz"
cd package
echo "//registry.npmjs.org/:_authToken=$authToken" > .npmrc
echo "remove unnecessary files"
rm -rf __tests__ src release.config.cjs tsconfig.json tsconfig.tsbuildinfo
# npm publish ./ --access public --dry-run
npm publish ./ --access public
