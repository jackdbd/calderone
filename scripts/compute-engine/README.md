# Compute Engine scripts

The following commands are meant to be executed from the monorepo root.

Upload the [startup script](https://cloud.google.com/compute/docs/instances/startup-scripts) to Cloud Storage:

```sh
gcloud storage cp scripts/compute-engine/startup-vm.sh gs://bkt-scripts
```

The script should be hosted here: https://storage.cloud.google.com/bkt-scripts/startup-vm.sh

To troubleshoot the startup script, connect to the VM using SSH...

```sh
gcloud compute ssh USER@INSTANCE_NAME
```

...then run this command from the VM:

```sh
journalctl -u google-startup-scripts.service
```
