# monitoring

Useful links:

- [Monitoring predefined IAM roles](https://cloud.google.com/monitoring/access-control#predefined_roles)

## Notification channels

Create all notification channels on the Google Cloud Console, [here](https://console.cloud.google.com/monitoring/alerting/notifications?project=prj-kitchen-sink).

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

Useful links:

- [Syntax to define Cloud Monitoring dashboards](https://cloud.google.com/monitoring/api/ref_v3/rest/v1/projects.dashboards)
- [Cloud Monitoring dashboards of this GCP project](https://console.cloud.google.com/monitoring/dashboards?project=prj-kitchen-sink&pageState=(%22dashboards%22:(%22t%22:%22All%22)))

## Uptime checks

Configure all uptime checks on the Google Cloud Console, in [Navigation menu > Monitoring > Uptime checks](https://console.cloud.google.com/monitoring/uptime?project=prj-kitchen-sink).

Each uptime check will automatically create an associated alerting policy.

Useful links:

- [Uptime checks of this GCP project](https://console.cloud.google.com/monitoring/alerting?project=prj-kitchen-sink)

## Alerting policies

Retrieve the list of alerting policies of this GCP project.

```sh
gcloud alpha monitoring policies list --project $GCP_PROJECT_ID
```

Alerting policy about request latency for a Cloud Run revision.

```sh
# from the monorepo root
gcloud alpha monitoring policies create \
--project $GCP_PROJECT_ID \
--policy-from-file ./monitoring/policies/request-latency-webhooks-giacomodebidda-com.yaml \
--documentation-format "text/markdown" \
--documentation-from-file "./monitoring/policies/request-latency.md"
```

Alerting policy about memory utilization for a Cloud Run revision.

```sh
# from the monorepo root
gcloud alpha monitoring policies create \
  --project $GCP_PROJECT_ID \
  --policy-from-file ./monitoring/policies/memory-utilization-webhooks-giacomodebidda-com.yaml \
  --documentation-format "text/markdown" \
  --documentation-from-file "./monitoring/policies/memory-utilization.md"
```

Useful links:

- [Alerting policies of this GCP project](https://console.cloud.google.com/monitoring/alerting?project=prj-kitchen-sink)
- [Incidents of this GCP project](https://console.cloud.google.com/monitoring/alerting/incidents?project=prj-kitchen-sink)
