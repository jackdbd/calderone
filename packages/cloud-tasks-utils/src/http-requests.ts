export interface HttpRequestToGCPServiceConfig {
  enqueued_by: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  service_account: string
  url: string
}

export const httpRequestToGCPService = (
  config: HttpRequestToGCPServiceConfig
) => {
  const { payload, enqueued_by, url, service_account } = config

  return {
    body: Buffer.from(JSON.stringify(payload)).toString('base64'),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Task-Enqueued-By': enqueued_by
    },
    // I think 99% we want to make a POST request. Maybe I could check whether I
    // have a payload, and if not, I make a GET request.
    httpMethod: 'POST' as const,
    oidcToken: {
      audience: url,
      serviceAccountEmail: service_account
    },
    url
  }
}

export interface HttpRequestToThirdPartyServiceConfig {
  api_key: string
  enqueued_by: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  url: string
}

export const httpRequestToThirdPartyService = (
  config: HttpRequestToThirdPartyServiceConfig
) => {
  const { payload, enqueued_by, url, api_key } = config

  return {
    body: Buffer.from(JSON.stringify(payload)).toString('base64'),
    headers: {
      Authorization: `Bearer ${api_key}`,
      'Content-Type': 'application/json; charset=utf-8',
      'X-Task-Enqueued-By': enqueued_by
    },
    // I think 99% we want to make a POST request. Maybe I could check whether I
    // have a payload, and if not, I make a GET request.
    httpMethod: 'POST' as const,
    url
  }
}
