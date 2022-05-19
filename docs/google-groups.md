# Google Groups

First of all, check that [gcloud is configured correctly](./gcloud-configuration.md).

You can manage Google Workspace groups from the [Admin Console](https://admin.google.com/ac/groups) or with gcloud.

## Enable the necessary services

```sh
gcloud services enable cloudidentity.googleapis.com

gcloud services enable cloudresourcemanager.googleapis.com
```

## Create a new Google Group

```sh
gcloud identity groups create developers@$GCP_ORGANIZATION \
--organization $GCP_ORGANIZATION \
--description 'Developers are responsible for designing, coding and testing applications.'
```

## List all members in a Google Group

List of members of the `developers` group.

```sh
gcloud identity groups memberships list \
--group-email developers@$GCP_ORGANIZATION
```

## Retrieve the details of a Google Group

```sh
gcloud identity groups describe developers@$GCP_ORGANIZATION
```

## Add a new member to an existing Google Group

```sh
gcloud identity groups memberships add \
--group-email developers@$GCP_ORGANIZATION \
--member-email demo@$GCP_ORGANIZATION \
--roles 'MEMBER'
```
