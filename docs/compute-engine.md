# Compute Engine

Useful links:

- [Debian images configuration](https://cloud.google.com/compute/docs/images/os-details#debian)
- [Troubleshooting VM startup scripts](https://cloud.google.com/compute/docs/troubleshooting/vm-startup)

## images

List all the available images:

```sh
gcloud compute images list --project $GCP_PROJECT_ID
```

## startup/shutdown scripts for Compute Engine VMs

List all Cloud Storage buckets for this GCP project:

```sh
gsutil ls -p $GCP_PROJECT_ID
```

If it's not already available, create a bucket and call it `bkt-scripts`:

```sh
gsutil mb \
  -p $GCP_PROJECT_ID \
  -l $CLOUD_STORAGE_ZONE \
  -c standard \
  gs://bkt-scripts
```

Copy the VM startup script to the Cloud Storage bucket:

```sh
gsutil cp ./scripts/startup-vm.sh gs://bkt-scripts/startup-vm.sh
```

List all files in the `bkt-scripts` bucket:

```sh
gsutil ls -p $GCP_PROJECT_ID gs://bkt-scripts
```

Print to stdout the content of `startup-vm.sh`:

```sh
gsutil cat -h gs://bkt-scripts/startup-vm.sh
```

Connect to the VM via SSH and [view the output of a Linux startup script](https://cloud.google.com/compute/docs/instances/startup-scripts/linux#viewing-output):

```sh
sudo journalctl -u google-startup-scripts.service
```

Connect to the VM via SSH and rerun a startup script:

```sh
sudo google_metadata_script_runner startup
```

## instances

Create a VM instance and run a startup script when it boots, and a shutdown script when it shuts down:

```sh
gcloud compute instances create example-instance \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE \
  --metadata-from-file startup-script=scripts/startup-vm.sh \
  --metadata-from-file shutdown-script=scripts/shutdown-vm.sh
```

or, when the scripts are hosted on Cloud Storage:

```sh
gcloud compute instances create example-debian-instance \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE \
  --machine-type f1-micro \
  --image-family debian-11 \
  --image-project debian-cloud \
  --boot-disk-size 30GB \
  --service-account $SA_COMPUTE_ENGINE \
  --scopes storage-ro \
  --metadata startup-script-url=https://storage.cloud.google.com/bkt-scripts/startup-vm.sh \
  --no-address
```

Connect to a VM instance using SSH:

```sh
gcloud compute ssh example-debian-instance \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE \
  --tunnel-through-iap
```

Retrieve the list of disk:

```sh
gcloud compute disks list --project $GCP_PROJECT_ID
```

Stop the VM instance:

```sh
gcloud compute instances stop example-debian-instance \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE
```

Create a machine image (*bake* an image) using the stopped VM as a starting point:

```sh
gcloud compute images create my-image \
  --project $GCP_PROJECT_ID \
  --source-disk example-debian-instance \
  --source-disk-zone $COMPUTE_ENGINE_ZONE
```

Delete an instance:

```sh
gcloud compute instances delete example-debian-instance \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE
```