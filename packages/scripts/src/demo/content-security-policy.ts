import path from 'node:path'
import PrettyError from 'pretty-error'
import { cspJSON } from '@jackdbd/content-security-policy'
import { monorepoRoot } from '@jackdbd/utils/path'

const pe = new PrettyError()

const main = async () => {
  const directives = {
    'base-uri': ['self'],

    'connect-src': [
      'self',
      'cloudflareinsights.com',
      'plausible.io',
      'res.cloudinary.com'
    ],

    'default-src': ['none'],

    'font-src': ['self'],

    'frame-src': [
      'https://www.youtube.com/embed/',
      'https://www.youtube-nocookie.com/',
      'https://player.vimeo.com/video/'
    ],

    'img-src': [
      'self',
      'github.com',
      'raw.githubusercontent.com',
      'res.cloudinary.com'
    ],

    // https://makandracards.com/makandra/503862-using-inline-event-handlers-with-a-strict-content-security-policy-csp
    'script-src-attr': ['self', 'unsafe-hashes', 'sha256'],

    'script-src-elem': [
      'self',
      'https://plausible.io/js/plausible.js',
      'https://static.cloudflareinsights.com/beacon.min.js',
      'https://unpkg.com/htm/preact/standalone.module.js'
    ],

    // https://content-security-policy.com/examples/allow-inline-style/
    'style-src-attr': ['self', 'unsafe-hashes', 'sha256'],

    'style-src-elem': ['self', 'sha256'],

    'worker-src': ['self']
  }

  //   const patterns = ['assets/html-pages/**/*.html']
  const patterns = [
    path.join(monorepoRoot(), 'assets', 'html-pages', '**/*.html')
  ]

  try {
    const obj = await cspJSON({ directives, patterns })
    console.log(`\nHere is the Content-Security-Policy\n`)
    console.log(obj)
  } catch (err: any) {
    console.log(pe.render(err))
  }
}

main()
