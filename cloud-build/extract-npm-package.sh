#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euxo pipefail

### Uncomment this section to try out the script on my computer ################
# NPM_SCOPE=jackdbd
# NPM_PACKAGE_NAME=checks
# NPM_PACKAGE_VERSION=latest
# DOWNLOAD_DIR=$(mktemp -d -t npm-pkg-XXXXXXXXXX)

# echo "Download @${NPM_SCOPE}/${NPM_PACKAGE_NAME}@${NPM_PACKAGE_VERSION}"
# npm pack "@${NPM_SCOPE}/${NPM_PACKAGE_NAME}@${NPM_PACKAGE_VERSION}" \
#   --pack-destination="${DOWNLOAD_DIR}"
################################################################################

cd "${DOWNLOAD_DIR}"

tar_filename_with_extension=$(ls -C)
# https://stackoverflow.com/questions/23431895/how-do-i-split-string-on-last-in-bash
# https://cloud.google.com/build/docs/configuring-builds/use-bash-and-bindings-in-substitutions#bash_parameter_expansions
version_with_extension="${tar_filename_with_extension##*-}"
# echo "version_with_extension ${version_with_extension}"
version="${version_with_extension%.*}"

echo "Extract ${DOWNLOAD_DIR}/${NPM_SCOPE}-${NPM_PACKAGE_NAME}-${version}"
tar -xvf "${NPM_SCOPE}-${NPM_PACKAGE_NAME}-${version_with_extension}"

echo "which wget"
echo which wget

echo "which curl"
echo which curl