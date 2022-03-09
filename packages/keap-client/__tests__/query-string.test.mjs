import { queryString } from '../lib/query-string.js'

describe('queryString', () => {
  it('is an empty string when there is neither pagination nor optional_properties', () => {
    const pagination = {}
    const optional_properties = ''

    const qs = queryString(pagination, optional_properties)

    expect(qs).toBe('')
  })

  it('is a string with contains all pagination options and all optional_properties', () => {
    const pagination = { email: 'john@doe.com', limit: 9 }
    const optional_properties = 'custom_fields,website'

    const qs = queryString(pagination, optional_properties)

    expect(qs).toContain('email')
    expect(qs).toContain('limit')
    expect(qs).toContain('custom_fields')
    expect(qs).toContain('website')
  })
})
