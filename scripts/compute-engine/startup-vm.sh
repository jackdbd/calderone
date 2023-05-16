#!/bin/bash

# This is a startup script that will be executed when a Compute Engine VM boots.
# All startup scripts are executed with root privileges, so there is no need to
# prepend any command with sudo.
#
# Upload this script to Cloud Storage with this command:
# gcloud storage cp startup-vm.sh gs://bkt-scripts
# Note: gs://bkt-scripts is the gsutil URI of the Cloud Storage bucket where I
# host several scripts).

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euxo pipefail

install_dir="/usr/local/bin"
babashka_version=1.3.179
datasette_version=0.64.3
nnn_version=4.8
pocketbase_version=0.15.3
zigup_version=2022_08_25

# It's always a good idea to update and upgrade before installing anything
apt --yes update
apt --yes upgrade

apt --yes install \
  apt-utils \
  ca-certificates \
  curl \
  dialog \
  gnupg \
  htop \
  lsb-release \
  neofetch \
  nginx \
  tree \
  unzip

### Babashka ###
# https://github.com/babashka/babashka
curl -L "https://github.com/babashka/babashka/releases/download/v${babashka_version}/babashka-${babashka_version}-linux-amd64-static.tar.gz" \
  --output babashka.tar.gz
tar xf babashka.tar.gz
rm -rf babashka.tar.gz
sudo mv bb $install_dir/bb

### Docker ###
# https://docs.docker.com/engine/install/debian/#install-using-the-repository
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

apt --yes update

# Install all versions of Docker CE available for this APT repository
apt --yes install \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-compose-plugin

# ### Datasette ###
# https://github.com/simonw/datasette
# At the moment Datasette is not distributed as standalone binary, so the
# easiest way to install it is by using Docker.
# TODO: solve docker permissions
# docker pull "datasetteproject/datasette:${datasette_version}"

curl -L https://latest.datasette.io/fixtures.db \
  --output datasette-fixtures.db

# docker run -p 8001:8001 -v `pwd`:/mnt \
#   datasetteproject/datasette:$datasette_version \
#   datasette -p 8001 -h 0.0.0.0 /mnt/datasette-fixtures.db

### nnn (file manager) ###
curl -L "https://github.com/jarun/nnn/releases/download/v${nnn_version}/nnn-musl-static-${nnn_version}.x86_64.tar.gz" \
  --output nnn.tar.gz
tar xf nnn.tar.gz
sudo mv nnn-musl-static $install_dir/nnn

### PocketBase ###
# https://github.com/pocketbase/pocketbase
curl -L "https://github.com/pocketbase/pocketbase/releases/download/v${pocketbase_version}/pocketbase_${pocketbase_version}_linux_amd64.zip" \
  --output pocketbase.zip
unzip pocketbase.zip
rm -rf pocketbase.zip CHANGELOG.md LICENSE.md
sudo mv pocketbase $install_dir/pocketbase

### zigup & zig ###
# https://github.com/marler8997/zigup
curl -L "https://github.com/marler8997/zigup/releases/download/v${zigup_version}/zigup.ubuntu-latest-x86_64.zip" \
  --output zigup.zip
unzip zigup.zip
chmod a+x zigup
sudo mv zigup $install_dir/zigup

zigup fetch master
zigup fetch 0.10.1
zigup list
