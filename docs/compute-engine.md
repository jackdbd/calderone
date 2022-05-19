# Compute Engine

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

Useful links:

- [Debian images configuration](https://cloud.google.com/compute/docs/images/os-details#debian)
- [Troubleshooting VM startup scripts](https://cloud.google.com/compute/docs/troubleshooting/vm-startup)

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

Copy the scripts to a Cloud Storage bucket:

```sh
gsutil cp ./scripts/startup-vm.sh gs://bkt-scripts/startup-vm.sh
gsutil cp ./scripts/setup-vm.sh gs://bkt-scripts/setup-vm.sh
gsutil cp ./scripts/shutdown-vm.sh gs://bkt-scripts/shutdown-vm.sh
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

Delete an instance:

```sh
gcloud compute instances delete example-debian-instance \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE
```

## instance templates

Retrieve the list of instance templates:

```sh
gcloud compute instance-templates list \
  --project $GCP_PROJECT_ID
```

You can also see the [list of instance templates in the Cloud Console](https://console.cloud.google.com/compute/instanceTemplates/list?project=prj-kitchen-sink).

Create an instance template for a VM I use for development purposes:

```sh
gcloud compute instance-templates create tmpl-debian-11 \
  --project $GCP_PROJECT_ID \
  --service-account sa-compute-engine@prj-kitchen-sink.iam.gserviceaccount.com \
  --machine-type e2-micro \
  --image-family debian-11 \
  --image-project debian-cloud \
  --boot-disk-size 40GB \
  --boot-disk-type pd-standard \
  --boot-disk-auto-delete \
  --metadata-from-file startup-script=scripts/startup-vm.sh,shutdown-script=scripts/shutdown-vm.sh \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=instance-template
```

Check the [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator#id=c7f84d96-9dbe-480f-84e0-a9104093e55e) to estimate monthly costs.

Delete the instance template:

```sh
gcloud compute instance-templates delete tmpl-debian-11 \
  --project $GCP_PROJECT_ID
```

Create a VM from an instance template:

```sh
gcloud compute instances create vm-development \
  --project $GCP_PROJECT_ID \
  --source-instance-template tmpl-debian-11 \
  --zone $COMPUTE_ENGINE_ZONE \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=vm
```

Delete the VM:

```sh
gcloud compute instances delete vm-development \
  --project $GCP_PROJECT_ID
```

## machine images

Retrieve the list of machine images in this GCP project:

```sh
gcloud compute machine-images list \
  --project $GCP_PROJECT_ID
```

You can also see the [list of machine images in the Cloud Console](https://console.cloud.google.com/compute/machineImages?project=prj-kitchen-sink).

Create a machine image (*bake* an image) using a VM as a starting point:

```sh
gcloud compute machine-images create machine-img-development \
  --project $GCP_PROJECT_ID \
  --source-instance vm-development \
  --source-instance-zone $COMPUTE_ENGINE_ZONE \
  --description "baked image of a VM I use for various development tasks"
```

If you need to stop the VM, here is how to do it:

```sh
gcloud compute instances stop vm-development \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE
```

Create a VM from a machine image:

```sh
gcloud beta compute instances create vm-development \
  --project $GCP_PROJECT_ID \
  --source-machine-image machine-img-development \
  --zone $COMPUTE_ENGINE_ZONE \
  --description "VM I use for various development tasks" \
  --labels customer=$CUSTOMER,environment=$ENVIRONMENT,resource=vm
```

Add `--no-address` if you do not want the VM to have an external IP address.

## connect to the VM

Connect to the VM:

```sh
gcloud compute ssh vm-development \
  --project $GCP_PROJECT_ID \
  --zone $COMPUTE_ENGINE_ZONE \
  --tunnel-through-iap
```

Download the script to setup the VM:

```sh
gsutil cp gs://bkt-scripts/setup-vm.sh ./scripts/setup-vm.sh
```

Assign the permissions to execute the script:

```sh
chmod 777 ./scripts/setup-vm.sh
```

Execute the script:

```sh
./scripts/setup-vm.sh
```
