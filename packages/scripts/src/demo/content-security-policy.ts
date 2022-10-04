import path from 'node:path'
import PrettyError from 'pretty-error'
import yargs from 'yargs'
import {
  cspDirectives,
  cspHeader,
  cspJSON
} from '@jackdbd/content-security-policy'
import {
  starter_policy,
  recommended_policy
} from '@jackdbd/content-security-policy/policies'
import { monorepoRoot } from '@jackdbd/utils/path'

const pe = new PrettyError()

interface Argv {
  format: string
  policy: string
}

const DEFAULT: Argv = {
  format: 'json',
  policy: 'recommeded'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .choices('format', ['directives', 'header', 'json'])
    .describe('policy', 'which CSP to use')
    .choices('policy', ['starter', 'recommeded', 'custom'])
    .default(DEFAULT).argv as Argv

  let directives = {}
  switch (argv.policy) {
    case 'custom': {
      directives = {
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
      break
    }

    case 'recommended': {
      directives = recommended_policy
      break
    }

    case 'starter': {
      directives = starter_policy
      break
    }

    default: {
      directives = recommended_policy
    }
  }

  //   const patterns = ['assets/html-pages/**/*.html']
  const patterns = [
    path.join(monorepoRoot(), 'assets', 'html-pages', '**/*.html')
  ]

  if (argv.format === 'json') {
    try {
      const obj = await cspJSON({ directives, patterns })
      console.log(`\nHere is the Content-Security-Policy (JSON)\n`)
      console.log(obj)
    } catch (err: any) {
      console.log(pe.render(err))
    }
  } else if (argv.format === 'directives') {
    try {
      const strings = await cspDirectives({ directives, patterns })
      console.log(`\nHere is the Content-Security-Policy (directives)\n`)
      console.log(strings)
    } catch (err: any) {
      console.log(pe.render(err))
    }
  } else if (argv.format === 'header') {
    try {
      const header = await cspHeader({ directives, patterns })
      console.log(`\nHere is the Content-Security-Policy (header)\n`)
      console.log(header)
    } catch (err: any) {
      console.log(pe.render(err))
    }
  } else {
    throw new Error(`forma ${argv.format} not implemented`)
  }
}

main()
