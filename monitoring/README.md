# monitoring

Useful links:

- [Syntax to define Cloud Monitoring dashboards](https://cloud.google.com/monitoring/api/ref_v3/rest/v1/projects.dashboards)
- [Cloud Monitoring dashboards of this GCP project](https://console.cloud.google.com/monitoring/dashboards?project=prj-kitchen-sink&pageState=(%22dashboards%22:(%22t%22:%22All%22)))

## Dashboards

List of all **custom** dashboards in this GCP project.

```sh
curl -X GET \
"https://monitoring.googleapis.com/v1/projects/$GCP_PROJECT_ID/dashboards" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $(gcloud auth print-access-token)"
```

Create a dashboard using a JSON file.

```sh
# from the monorepo root
curl -X POST \
-L "https://monitoring.googleapis.com/v1/projects/$GCP_PROJECT_ID/dashboards" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $(gcloud auth print-access-token)" \
-d "@./monitoring/dashboards/cloud-run-billable-time.json"
```

## Alerting policies

Retrieve the list of alerting policies of this GCP project

```sh
gcloud alpha monitoring policies list --project $GCP_PROJECT_ID
```
