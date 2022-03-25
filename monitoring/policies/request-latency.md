# Request latency

Description of the metric `request_latencies`, as reported on the page containing the [list of metrics for managed Cloud Run](https://cloud.google.com/monitoring/api/metrics_gcp#gcp-run):

> Distribution of request latency in milliseconds reaching the revision. Latency is measured from when the request reaches the running container to when it exits. Notably, it **does not include container startup latency**. Sampled every 60 seconds. After sampling, data is not visible for up to 180 seconds.

Useful links:

- [Alerting best practices for Google Cloud Monitoring](https://youtu.be/UjL-BlixJKY?t=342): good explanation of `alignmentPeriod` and `duration`.
- [How to avoid common alerting mistakes](https://youtu.be/QMyS-upk9ZU): short video, useful as a quick reminder.
