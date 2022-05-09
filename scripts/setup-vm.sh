#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

# https://docs.docker.com/engine/install/debian/#install-using-the-repository
echo "install Docker"
sudo apt-get update

sudo apt-get install \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

# Install all versions of Docker CE available for this APT repository
sudo apt-get install --quiet --yes \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-compose-plugin

# or...
# List the versions of Docker CE available for this APT repository
# apt-cache madison docker-ce
# Install a specific version of Docker CE
# docker_ce_version=5:20.10.15~3-0~debian-bullseye
# echo "install Docker CE $docker_ce_version"
# sudo apt-get install \
#   docker-ce=$docker_ce_version \
#   docker-ce-cli=$docker_ce_version \
#   containerd.io \
#   docker-compose-plugin

datasette_version=0.61.1
echo "install Datasette version $datasette_version"
sudo docker pull datasetteproject/datasette:$datasette_version

echo "download fixtures DB"
curl -L https://latest.datasette.io/fixtures.db --output fixtures.db

echo "Run Datasette $datasette_version"
sudo docker run -p 8001:8001 -v `pwd`:/mnt \
    datasetteproject/datasette:$datasette_version \
    datasette -p 8001 -h 0.0.0.0 /mnt/fixtures.db
