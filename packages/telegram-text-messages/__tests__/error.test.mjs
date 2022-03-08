import { errorText } from '../lib/error.js'

describe('errorText', () => {
  const app_name = 'my service'
  const app_version = '0.0.1'
  const error_title = 'ops: I crashed'
  const error_message = 'detailed explanation why I crashed'

  it('wraps error_title in a <b> tag and adds a red cross emoji', () => {
    const text = errorText({ app_name, error_message, error_title })

    expect(text).toContain(`<b>❌ ${error_title}</b>`)
  })

  it('wraps error_message in a <pre> tag', () => {
    const text = errorText({ app_name, error_message, error_title })

    expect(text).toContain(`<pre>${error_message}</pre>`)
  })

  it('wraps links in <a> tags', () => {
    const text = errorText({
      app_name,
      app_version,
      error_message,
      error_title,
      links: [
        { href: 'https://www.google.com/', text: 'first link' },
        { href: 'https://core.telegram.org/bots/api', text: 'second link' }
      ]
    })

    expect(text).toContain(`<a href="https://www.google.com/">first link</a>`)
    expect(text).toContain(
      `<a href="https://core.telegram.org/bots/api">second link</a>`
    )
  })
})
