import { httpRequestToGCPService } from '../lib/http-requests.js'

describe('httpRequestToGCPService', () => {
  it('has an `oidcToken` param (for the OIDC token)', () => {
    const req = httpRequestToGCPService({
      payload: { answer: 42 },
      enqueued_by: 'jest',
      url: 'example.come',
      service_account:
        'my-service-account@my-gcp-project.iam.gserviceaccount.com'
    })

    expect(req).toBeDefined()
    expect(req.oidcToken).toBeDefined()
  })
})
