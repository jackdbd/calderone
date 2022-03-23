# external HTTP(S) load balancer (L7)

This GCP project uses an [external HTTP(S) Load Balancer](https://cloud.google.com/load-balancing/docs/https), a proxy-based Layer 7 load balancer that enables you to run and scale your services behind a single external, static IP address (anycast IP address).

## 1 - Reserve an external, static IP address

Set up a [global static external IP address](https://cloud.google.com/compute/docs/ip-addresses/reserve-static-external-ip-address) that your customers use to reach your load balancer.

```sh
gcloud compute addresses create ip-https-load-balancer \
  --network-tier PREMIUM \
  --ip-version IPV4 \
  --global \
  --description 'global external static IPv4 address for the HTTPS load balancer' \
  --project $GCP_PROJECT_ID
```

Check that the address was created and its status is `RESERVED` or `IN_USE`.

```sh
gcloud compute addresses list --project $GCP_PROJECT_ID

gcloud compute addresses describe ip-https-load-balancer \
  --global \
  --format="get(address,ipVersion,name,networkTier,status)" \
  --project $GCP_PROJECT_ID
```

You can also check the external IP address in the Google Cloud Console, in [VPC network > External IP addresses](https://console.cloud.google.com/networking/addresses/list?project=prj-kitchen-sink).

## 2 - Create SSL certificates

To create an HTTPS load balancer, you must add an SSL certificate resource to the load balancer's front end.

To create a Google-managed certificate, you must have a domain and the DNS records for that domain in order for the certificate to be provisioned. See [here](https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless?hl=en#ssl_certificate_resource) for details.

You can either create a SSL certificate for a single subdomain:

```sh
gcloud compute ssl-certificates create ssl-cert-webhooks-giacomodebidda-com \
  --description 'Google-managed SSL certificate for webhooks.giacomodebidda.com' \
  --domains webhooks.giacomodebidda.com \
  --global \
  --project $GCP_PROJECT_ID
```

or you can create a SSL certificate for multiple subdomains:

```sh
gcloud compute ssl-certificates create ssl-cert-subdomains-giacomodebidda-com \
  --description 'Google-managed SSL certificate for some subdomains of giacomodebidda.com' \
  --domains analytics.giacomodebidda.com,audit.giacomodebidda.com \
  --global \
  --project $GCP_PROJECT_ID
```

But you cannot create a SSL certificate with a wildcard. For that you would need [Certificate Manager](https://cloud.google.com/certificate-manager/docs?authuser=1).

Check that the SSL certificate was created and its status is `PROVISIONING`. Provisioning a Google-managed certificate might take up to 60 minutes. See [Troubleshooting SSL certificates](https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting) for details.

Check the list of SSL certificates:

```sh
gcloud compute ssl-certificates list --project $GCP_PROJECT_ID
```

Check the details of each SSL certificate:

```sh
gcloud compute ssl-certificates describe ssl-cert-webhooks-giacomodebidda-com \
  --project $GCP_PROJECT_ID
```

```sh
gcloud compute ssl-certificates describe ssl-cert-subdomains-giacomodebidda-com \
  --project $GCP_PROJECT_ID
```

Updating the domain status can take a long time, since the [DNS propagation can take up to 72 hours](https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting#domain-status).

## 3 - Create a serverless NEG (Network Endpoint Group) - REVIEW

The load balancer uses a serverless NEG backend to direct requests to a serverless Cloud Run service. This NEG must be in the same GCP region of the Cloud Run service.

There should be a ratio 1:1 of a Cloud Run service with a serverless NEG.

First, check the **name** of the Cloud Run service and in which **region** it is deployed.

```sh
gcloud run services list --project $GCP_PROJECT_ID
```

Then, create the NEG for that service.

```sh
gcloud beta compute network-endpoint-groups create neg-calderone-webhooks \
  --region europe-west3 \
  --network-endpoint-type serverless  \
  --cloud-run-service calderone-webhooks-production \
  --project $GCP_PROJECT_ID
```

Check that the NEG was created.

```sh
gcloud beta compute network-endpoint-groups list --project $GCP_PROJECT_ID

gcloud beta compute network-endpoint-groups describe neg-calderone-webhooks \
  --project $GCP_PROJECT_ID \
  --region europe-west3 \
  --format="get(id,kind,networkEndpointType)"
```

You can also check the Network endpoint groups in the Google Cloud Console, in [Compute Engine > Network endpoint groups](https://console.cloud.google.com/compute/networkendpointgroups/list?project=prj-kitchen-sink).

## 4 - Create and configure a backend service - REVIEW

### Create a backend service

A backend service defines how Cloud Load Balancing distributes traffic. The configuration of a backend service can have [many parameters](https://cloud.google.com/sdk/gcloud/reference/beta/compute/backend-services/create).

```sh
gcloud beta compute backend-services create backend-calderone-webhooks \
  --load-balancing-scheme EXTERNAL_MANAGED \
  --global \
  --project $GCP_PROJECT_ID \
  --description 'backend service for the HTTPS load balancer'
```

Check that the backend service was created and that its protocol is HTTP and its port is 80.

```sh
gcloud beta compute backend-services list --project $GCP_PROJECT_ID

gcloud beta compute backend-services describe backend-calderone-webhooks \
  --global \
  --project $GCP_PROJECT_ID
```

See [here](https://cloud.google.com/load-balancing/docs/backend-service) to know more about backend services in a load balancer.

### Add the serverless NEG as a backend to the backend service

Complete the configuration of the backend service by linking the NEG to the service deployed on Cloud Run.

```sh
gcloud beta compute backend-services add-backend backend-calderone-webhooks \
  --global \
  --network-endpoint-group neg-calderone-webhooks \
  --network-endpoint-group-region europe-west3 \
  --description 'directs traffic from HTTPS load balancer to Cloud Run service calderone-webhooks' \
  --project $GCP_PROJECT_ID
```

Check the configuration.

```sh
gcloud beta compute backend-services describe backend-calderone-webhooks \
  --global \
  --project $GCP_PROJECT_ID
```

You can also check the backend services in the Google Cloud Console, either in [Network services > Load balancing > load balancers view > BACKENDS](https://console.cloud.google.com/net-services/loadbalancing/list/backends?project=prj-kitchen-sink), or in [Network services > Load balancing > load balancing components view > BACKEND SERVICES](https://console.cloud.google.com/net-services/loadbalancing/advanced/backendServices/list?project=prj-kitchen-sink).

## 5 - Create a URL map

A Google Cloud external HTTPS load balancer is able to route requests to backend services or backend buckets using a configuration resource called URL map.

Since a URL map might contain many host rules and path matchers, it's better to define it using a YAML file. I keep my URL map configuration [here](../config/url-map-load-balancer.yaml).

First, make sure that the URL map is valid:

```sh
gcloud compute url-maps validate \
  --source ./config/url-map-load-balancer.yaml \
  --project $GCP_PROJECT_ID
```

Then create/update the URL map by importing the YAML file:

```sh
gcloud beta compute url-maps import url-map-giacomodebidda-com \
  --source ./config/url-map-load-balancer.yaml \
  --project $GCP_PROJECT_ID
```

Check the URL maps available in this GCP project:

```sh
gcloud beta compute url-maps list \
  --project $GCP_PROJECT_ID
```

Check the details of a specific URL map:

```sh
gcloud beta compute url-maps describe url-map-giacomodebidda-com \
  --project $GCP_PROJECT_ID
```

```sh
gcloud beta compute url-maps export url-map-giacomodebidda-com \
  --destination ./config/url-map-exported.yaml \
  --project $GCP_PROJECT_ID
```

You can also check the URL maps in the Google Cloud Console, in [Network services > Load balancing > load balancers view > LOAD BALANCERS](https://console.cloud.google.com/net-services/loadbalancing/list/loadBalancers?project=prj-kitchen-sink).

## 6 - Create an HTTPS target proxy

When using a Google Cloud external HTTPS load balancer, all incoming traffic hits the [Google Frontend Service (GFE)](https://cloud.google.com/docs/security/infrastructure/design#google_front_end_service) at the global, static external ip. This traffic is then forwarded to a HTTPS proxy.

The HTTPS proxy routes requests to the URL map. You can create this HTTPS proxy even if the SSL certificate is still in the `PROVISIONING` state.

Since a HTTPS proxy might have several SSL certificates attached, it's better to define it using a YAML file. I keep my URL map configuration [here](../config/https-proxy.yaml).

```sh
gcloud beta compute target-https-proxies import https-proxy-giacomodebidda-com \
  --source ./config/https-proxy.yaml \
  --project $GCP_PROJECT_ID
```

Check the list of HTTPS proxies.

```sh
gcloud beta compute target-https-proxies list \
  --project $GCP_PROJECT_ID
```

Check the details of a HTTPS proxy.

```sh
gcloud beta compute target-https-proxies describe https-proxy-giacomodebidda-com \
  --project $GCP_PROJECT_ID
```

You can also check the list of target proxies in the Google Cloud Console, in [Network services > Load balancing > load balancing components view > TARGET PROXIES](https://console.cloud.google.com/net-services/loadbalancing/advanced/targetProxies/list?project=prj-kitchen-sink).

## 7 - Create global forwarding rule - REVIEW

A global forwarding rule represents the frontend of a Google Cloud external HTTPS load balancer. It forwards traffic hitting the [Google Frontend Service (GFE)](https://cloud.google.com/docs/security/infrastructure/design#google_front_end_service) at the global, static external ip, and on the selected ports, to the HTTPS proxy.

Create a global forwarding rule to route incoming requests to the HTTPS proxy.

```sh
gcloud beta compute forwarding-rules create allow-https \
  --target-https-proxy https-proxy-giacomodebidda-com \
  --load-balancing-scheme EXTERNAL_MANAGED \
  --network-tier PREMIUM \
  --global \
  --address ip-https-load-balancer \
  --ports 443 \
  --description 'forwards HTTPS traffic to the HTTPS target proxy' \
  --project $GCP_PROJECT_ID
```

Check that the forwarding rule was created.

```sh
gcloud beta compute forwarding-rules list --project $GCP_PROJECT_ID

gcloud beta compute forwarding-rules describe allow-https \
  --global \
  --project $GCP_PROJECT_ID \
  --format="get(IPAddress,IPProtocol,description,loadBalancingScheme,name,networkTier,portRange,target)"
```

You can also check the list of global forwarding rules in the Google Cloud Console, in [Network services > Load balancing > load balancing components view > FORWARDING RULES](https://console.cloud.google.com/net-services/loadbalancing/advanced/forwardingRules/list?project=prj-kitchen-sink).

## 8 - Connect your domain to your load balancer

Go to your DNS provider (I use Netlify DNS) and add one or more **A** records that point to the load balancer's IP address.

See an example [here](https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless?hl=en#update_dns).

Here are my [DNS settings on Netlify DNS](https://app.netlify.com/teams/jackdbd/dns/giacomodebidda.com).

Check the DNS propagation on [dnschecker.org](https://dnschecker.org/). For example, this is the DNS propagation of [webhooks.giacomodebidda.com](https://dnschecker.org/#A/webhooks.giacomodebidda.com)

## Troubleshooting

- [issues with the SSL certificate](https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting)

Check the [certificate managed status](https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting#certificate-managed-status) and the [domain status](https://cloud.google.com/load-balancing/docs/ssl-certificates/troubleshooting#domain-status). Remember: provisioning a Google-managed certificate might take up to 60 minutes, and it might take an additional 30 minutes to be available for use by a load balancer.

```sh
gcloud compute ssl-certificates describe ssl-cert-webhooks-giacomodebidda-com \
  --project $GCP_PROJECT_ID
```

```sh
gcloud compute ssl-certificates describe ssl-cert-subdomains-giacomodebidda-com \
  --project $GCP_PROJECT_ID
```

Check that the HTTPS proxy uses this SSL certicate.

```sh
gcloud compute target-https-proxies describe https-proxy-giacomodebidda-com \
  --project $GCP_PROJECT_ID \
  --format="get(name,sslCertificates)"
```

Make sure to add or update the DNS A records (for IPv4) and DNS AAAA records (for IPv6) for your domains and any subdomains. See [here](https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs#update-dns).
