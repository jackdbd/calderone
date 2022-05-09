# Memory utilization

Description of the metric `container/memory/utilizations`, as reported on the page containing the [list of metrics for managed Cloud Run](https://cloud.google.com/monitoring/api/metrics_gcp#gcp-run):

> Container memory utilization distribution across all container instances of the revision. Sampled every 60 seconds. After sampling, data is not visible for up to 60 seconds.

Useful links:

- [Alerting best practices for Google Cloud Monitoring](https://youtu.be/UjL-BlixJKY?t=342): good explanation of `alignmentPeriod` and `duration`.
- [How to avoid common alerting mistakes](https://youtu.be/QMyS-upk9ZU): short video, useful as a quick reminder.
