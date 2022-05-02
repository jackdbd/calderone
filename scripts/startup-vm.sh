#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

babashka_version=0.8.1
install_dir="/usr/local/bin"

echo "download Babashka $babashka_version"
curl -L "https://github.com/babashka/babashka/releases/download/v$babashka_version/babashka-$babashka_version-linux-amd64-static.tar.gz" \
--output babashka.tar.gz

tar xf babashka.tar.gz
rm babashka.tar.gz

# when a Compute Engine VM boots, the startup script runs as root, so sudo is not required.
mv bb $install_dir
