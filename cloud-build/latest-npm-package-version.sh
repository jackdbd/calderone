#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euxo pipefail

### Uncomment this section to try out the script on my computer ################
# NPM_SCOPE=jackdbd
# NPM_PACKAGE_NAME=checks
# NPM_PACKAGE_VERSION_FILE=latest-npm-package-version.txt
# REPO_ID=npm-registry
# REPO_LOCATION_ID=europe-west3
################################################################################

echo "Retrieve latest version of @${NPM_SCOPE}/${NPM_PACKAGE_NAME} from Artifact Registry repository \"${REPO_ID}\" (${REPO_LOCATION_ID})"

latest_version=$(gcloud artifacts versions list \
  --sort-by ~UPDATE_TIME \
  --limit 1 \
  --format 'value(format("{0}",name))' \
  --location ${REPO_LOCATION_ID} \
  --repository ${REPO_ID} \
  --package "@${NPM_SCOPE}/${NPM_PACKAGE_NAME}")

echo "write latest version of package @${NPM_SCOPE}/${NPM_PACKAGE_NAME} to ${NPM_PACKAGE_VERSION_FILE}"
echo "${latest_version}" > ${NPM_PACKAGE_VERSION_FILE}
cat ${NPM_PACKAGE_VERSION_FILE}
