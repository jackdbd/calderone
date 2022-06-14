#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

### Uncomment this section to try out the script on my computer ################
# TAR_FILEPATH=babashka-${BABASHKA_VERSION}-${OS}-${ARCH}.tar.gz
################################################################################

echo "Extract ${TAR_FILEPATH}"
tar -xvf "${TAR_FILEPATH}"

DEST=/usr/bin
echo "Move bb to ${DEST}"
mv bb ${DEST}
