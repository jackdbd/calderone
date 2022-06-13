#!/bin/bash

# https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/
set -euo pipefail

### Uncomment this section to try out the script on my computer ################
# CHAT_ID=
# TOKEN=
################################################################################

curl -X POST \
-L "https://api.telegram.org/bot${TOKEN}/sendMessage" \
-H "Content-Type: application/json" \
--data-raw "{
    \"chat_id\": \"${CHAT_ID}\",
    \"text\": \"Hello from Cloud Build\"
}"
