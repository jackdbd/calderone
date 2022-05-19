# Cloud Build

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

Useful links:

- [Cloud Builds predefined IAM roles](https://cloud.google.com/build/docs/iam-roles-permissions)
- [gcloud builds reference](https://cloud.google.com/sdk/gcloud/reference/builds)
- [Create manual triggers](https://cloud.google.com/build/docs/automating-builds/create-manual-triggers)

Submit a new build:

```sh
gcloud builds submit . --config cloudbuild.yaml --async
```

List ongoing builds:

```sh
gcloud builds list --ongoing
```

List Cloud Build triggers:

```sh
gcloud beta builds triggers list
```

Import a Cloud Build trigger from a YAML file:

```sh
gcloud beta builds triggers import \
--source cloud-build-triggers/git-push-github-repo-any-branch.yaml
```

Export an existing Cloud Build trigger:

```sh
gcloud beta builds triggers export git-push-github-repo-any-branch \
--destination cloud-build-triggers/git-push-github-repo-any-branch-exported.yaml
```

Run a Cloud Build trigger, from the branch `main` of the git repo hosted on GitHub:

```sh
gcloud beta builds triggers run git-push-github-repo-any-branch \
--branch main
```
