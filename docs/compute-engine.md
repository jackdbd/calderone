# Compute Engine

This GCP project includes a Compute Engine VM that I use for various development tasks. This VM is **not** directly exposed to the public internet.

## Preliminary operations

1. Check that [gcloud is configured correctly](./gcloud-configuration.md).
1. Create a Cloud Storage bucket for the Compute Engine VM startup/shutdown scripts.

## Useful links:

- [Debian images configuration](https://cloud.google.com/compute/docs/images/os-details#debian)
- [Troubleshooting VM startup scripts](https://cloud.google.com/compute/docs/troubleshooting/vm-startup)

## 1. Upload startup/shutdown scripts to Cloud Storage

List all Cloud Storage buckets for this GCP project:

```sh
gsutil ls
```

If it's not already available, create a bucket and call it `bkt-scripts`:

```sh
gsutil mb \
  -p $GCP_PROJECT_ID \
  -l $CLOUD_STORAGE_ZONE \
  -c standard \
  gs://bkt-scripts
```

Copy the script [startup-vm.sh](../scripts/compute-engine/startup-vm.sh) to the Cloud Storage bucket `bkt-scripts` (run this command from the monorepo root):

```sh
gcloud storage cp ./scripts/compute-engine/startup-vm.sh gs://bkt-scripts

# in alternative
gsutil cp ./scripts/compute-engine/startup-vm.sh gs://bkt-scripts/startup-vm.sh
```

List all files in the `bkt-scripts` bucket:

```sh
gsutil ls gs://bkt-scripts
```

Print to stdout the content of `startup-vm.sh`:

```sh
gsutil cat -h gs://bkt-scripts/startup-vm.sh
```

## 2. Provision the Compute Engine VM

I think it's better to create the VM using the web UI. A few notes:

- Copy-paste the startup script in the web UI. Pasting the Cloud Storage bucket URL seems not to work.
- Assign `api.giacomodebidda.com` as the Hostname.
- Use a `e2-micro` [machine type](https://cloud.google.com/compute/docs/machine-resource).
- Use a [zonal balanced persistent disk](https://cloud.google.com/compute/docs/disks) of at least 20 GB as the boot disk. Data is encrypted automatically using a Google-managed encryption key (no configuration required).

> :information_source: **Note:**
>
> A VM like this should cost less than 10 USD a month.
> You can also check [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator#id=c7f84d96-9dbe-480f-84e0-a9104093e55e) to estimate monthly costs of a VM like this.

This gcloud command should create a VM **similar** to the one I want. **Do NOT copy this!**

```sh
gcloud compute instances create vm-development \
  --zone ${COMPUTE_ENGINE_ZONE} \
  --machine-type e2-micro \
  --network-interface network-tier=PREMIUM,stack-type=IPV4_ONLY,subnet=default \
  --maintenance-policy MIGRATE \
  --provisioning-model STANDARD \
  --service-account "${GCP_PROJECT_NUM}-compute@developer.gserviceaccount.com" \
  --scopes "https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append" \
  --enable-display-device \
  --create-disk "auto-delete=yes,boot=yes,device-name=vm-development,image=projects/debian-cloud/global/images/debian-11-bullseye-v20230509,mode=rw,size=20,type=projects/prj-kitchen-sink/zones/${COMPUTE_ENGINE_ZONE}/diskTypes/pd-balanced" \
  --no-shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --labels "customer=personal,ec-src=vm_add-gcloud" \
  --reservation-affinity any
  --metadata "startup-script-url=https://storage.cloud.google.com/bkt-scripts/startup-vm.sh" \
  --no-address
```

Retrieve the list of disk:

```sh
gcloud compute disks list
```

Connect to the VM using SSH:

```sh
gcloud compute ssh giacomo@vm-development
```

Check that the startup script ran correctly by [viewing its output](https://cloud.google.com/compute/docs/instances/startup-scripts/linux#viewing-output):

```sh
sudo journalctl -u google-startup-scripts.service
```

In there were any issues, try re-running the startup script manually:

```sh
sudo google_metadata_script_runner startup
```

> :information_source: **Note:**
>
> The startup script might take a few minutes to complete. It depends on many packages you are installing/updating in your script. Give it some time.

Check that the software you installed in the startup script is available. For example:

```sh
neofetch

bb --version

pocketbase --version
```

> :information_source: **Note:**
>
> You could also:
> - [create an instance template from this VM](https://cloud.google.com/compute/docs/instance-templates/create-instance-templates#based-on-existing-instance).
> - [create a machine image (*bake* an image)](https://cloud.google.com/compute/docs/machine-images/create-machine-images#create-image-from-instance) using this VM as a starting point.
