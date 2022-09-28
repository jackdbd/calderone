export const PATTERNS = ['../../assets/html-pages/**/*.html']

export const DIRECTIVES = {
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
