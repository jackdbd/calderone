# gcloud configuration

The gcloud CLI can be configured with a file which can be found in the `~/.config/gcloud/configurations/` directory. The default configuration file is `~/.config/gcloud/configurations/config_default`, but you can have as many configurations as you want. Each gcloud configuration file must have a name that starts with `config_`.

## gcloud configuration file for this project

Create a gcloud configuration file and name it `config_calderone`. Here is the full path on my machine: `~/.config/gcloud/configurations/config_calderone`

Check the list of gcloud configurations with this command:

```sh
gcloud config configurations list
```

Check the content of a gcloud configuration file with this command:

```sh
gcloud info
```

Check that you are now using the expected account and the expected project:

```sh
gcloud config get account
gcloud config get project
```

Check that these properties are set, using the syntax `section/property`:

```sh
gcloud config get compute/zone
gcloud config get functions/region
gcloud config get run/region
gcloud config get workflows/location
```

## Automatic configuration switching

You can [auto-switch](https://cloud.google.com/sdk/docs/configurations#automating_configuration_switching) to the `calderone` gcloud configuration when you jump into this repository's root directory if you set the `CLOUDSDK_ACTIVE_CONFIG_NAME` environment variable in your `.envrc` file.

```sh
export CLOUDSDK_ACTIVE_CONFIG_NAME=calderone
```

Don't forget to re-run `direnv allow` if you made changes to the `.envrc` file.
