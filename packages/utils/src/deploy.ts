import makeDebug from 'debug'

const debug = makeDebug('utils/deploy')

export const regexFactory = (tag = 'env') => {
  return new RegExp(`\\\${{ ?(${tag})\\.([-0-9A-Z_a-z]+) ?}}`)
}

export const envVarNotFoundInEnv = (s: string) =>
  `environment variable ${s} not found in given env`

export interface Options {
  env?: NodeJS.ProcessEnv
}

export const stringResolvedFromEnv = (s: string, options?: Options) => {
  const env = options?.env || process.env

  const groups = s.match(regexFactory('env'))
  if (groups) {
    const [_input, _tag, v] = groups
    if (!env[v]) {
      throw new Error(envVarNotFoundInEnv(v))
    } else {
      debug(`${s} => ${env[v]}`)
      return env[v]
    }
  } else {
    return s
  }
}

export const entriesResolvedFromEnv = (
  entries: any[],
  options?: Options
): string[] => {
  return entries.map(([k, v]) => {
    if (typeof v === 'object') {
      const value = entriesResolvedFromEnv(Object.entries(v), options)
      return `${k}=${value}`
    } else if (typeof v === 'boolean') {
      return `${k}=${v}`
    } else if (typeof v === 'number') {
      return `${k}=${v}`
    } else {
      return `${k}=${stringResolvedFromEnv(v, options)}`
    }
  })
}

export const requiredConfigValueNotSet = (s: string) =>
  `${s} not set. If you want to use secrets in your configuration, you must set ${s}`

export const gcloudArgs = (config: any, options?: Options) => {
  debug('input configuration %O', config)

  const args = Object.entries(config).flatMap(([key, value]) => {
    if (value === true) {
      return [`--${key}`]
    }

    if (value === false) {
      return [`--no-${key}`]
    }

    if (typeof value === 'number') {
      return [`--${key}`, value]
    }

    switch (key) {
      case 'gcp-project-num': {
        // The Google Cloud Project number is required in the config to create
        // the secret URL, but it's not an argument accepeted by gcloud. That's
        // why we discard it here.
        return []
      }

      case 'set-env-vars':
      case 'update-labels': {
        const unresolved_entries = Object.entries(value as any)
        const entries = entriesResolvedFromEnv(unresolved_entries, options)
        return [`--${key}`, entries.join(',')]
      }

      case 'set-secrets': {
        const prj = stringResolvedFromEnv(config['gcp-project-num'], options)
        if (!prj) {
          throw new Error(requiredConfigValueNotSet('gcp-project-num'))
        }
        const secrets = []
        for (const [k, v] of Object.entries(value as any)) {
          const [unresolved_name, unresolved_version] = (v as string).split(':')
          const name = stringResolvedFromEnv(unresolved_name, options)
          const version = stringResolvedFromEnv(unresolved_version, options)
          secrets.push(`${k}=projects/${prj}/secrets/${name}:${version}`)
        }
        return [`--${key}`, secrets.join(',')]
      }

      default: {
        if (typeof value === 'object') {
          throw new Error(
            `key ${key} not implemented. TODO: if it's a valid gcloud config value, implement it, otherwise discard it/throw an error`
          )
        } else {
          const v = stringResolvedFromEnv(value as any, options) as string
          return [`--${key}`, v]
        }
      }
    }
  })

  return args
}
