#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

scope=$1 # e.g. jackdbd
package=$2 # e.g. firestore-utils
version=$3 # e.g. 1.2.3

authToken=$NPM_TOKEN

tmp_dir=$(mktemp -d -t npm-pkg-XXXXXXXXXX)
cd $tmp_dir
echo "//registry.npmjs.org/:_authToken=$authToken" > .npmrc
npm unpublish "@$scope/$package@$version" --force --verbose
# npm unpublish "@$scope/$package@$version"
