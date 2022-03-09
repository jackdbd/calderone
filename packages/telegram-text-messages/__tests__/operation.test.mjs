import { operationText } from '../lib/operation.js'

describe('operationText', () => {
  const title = 'some operation'
  const successes = ['win one', 'win two', 'win three']
  const failures = ['strike one', 'strike two']
  const warnings = ['watchout']

  it('wraps `title` in a <b> tag', () => {
    const text = operationText({
      title,
      successes,
      failures,
      warnings
    })

    expect(text).toContain(`<b>${title}</b>`)
  })

  it('adds a green check mark emoji for each success', () => {
    const text = operationText({
      title,
      successes,
      failures,
      warnings
    })

    successes.forEach((success) => {
      expect(text).toContain(`✅ ${success}`)
    })
  })

  it('adds a red cross emoji for each failure', () => {
    const text = operationText({
      title,
      successes,
      failures,
      warnings
    })

    failures.forEach((failure) => {
      expect(text).toContain(`❌ ${failure}`)
    })
  })

  it('adds a warning sign for each warning', () => {
    const text = operationText({
      title,
      successes,
      failures,
      warnings
    })

    warnings.forEach((warning) => {
      expect(text).toContain(`⚠️ ${warning}`)
    })
  })
})
