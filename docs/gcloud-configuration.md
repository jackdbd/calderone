# gcloud configuration

gcloud can be configured with a file which can be found in the `~/.config/gcloud/configurations/` directory. The default configuration file is `~/.config/gcloud/configurations/config_default`, but you can have as many configurations as you want. Each gcloud configuration file must have a name that starts with `config_`.

Create a configuration file and name it `config_calderone`. Here is the full path on my machine: `~/.config/gcloud/configurations/config_calderone`

Check the list of gcloud configurations with this command:

```sh
gcloud config configurations list
```

Double check that you are now using the expected account and the expected project:

```sh
gcloud config get account
gcloud config get project
```

## automatic configuration switching

You can [auto-switch](https://cloud.google.com/sdk/docs/configurations#automating_configuration_switching) to the `tomato` gcloud configuration when you jump to this repository's root directory if you set the `CLOUDSDK_ACTIVE_CONFIG_NAME` environment variable in your `.envrc` file.

```sh
export CLOUDSDK_ACTIVE_CONFIG_NAME=calderone
```
