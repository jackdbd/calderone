import { env } from 'node:process'
import {
  execSync,
  spawn,
  ChildProcessWithoutNullStreams
} from 'node:child_process'
import makeDebug from 'debug'
import waitPort from 'wait-port'

const debug = makeDebug('utils/test')

export interface Options {
  env?: NodeJS.ProcessEnv
  port?: number
  source?: string
  target?: string
}

const DEFAULT = {
  env,
  port: 8080,
  source: 'dist/bundle.js',
  target: 'entryPoint'
}

/**
 * Spawns a child process that will launch the Functions Framework (basically a
 * HTTP server) on the specified port.
 *
 * @experimental
 *
 * @see [Integration tests - Cloud Functions](https://cloud.google.com/functions/docs/testing/test-background#integration_tests)
 * @see [Configure the Functions Framework](https://github.com/GoogleCloudPlatform/functions-framework-nodejs#configure-the-functions-framework)
 * @see [killport](https://github.com/splendourhui/killport)
 */
export const spawnFunctionsFramework = async (options?: Options) => {
  const env = (options && options.env) || DEFAULT.env
  const port = (options && options.port) || DEFAULT.port
  const source = (options && options.source) || DEFAULT.source
  const target = (options && options.target) || DEFAULT.target

  const npx = execSync('which npx').toString().trim()

  const args = [
    'functions-framework',
    '--source',
    `${source}`,
    '--target',
    `${target}`,
    '--signature-type',
    'http',
    '--port',
    `${port}`
  ]

  const child = spawn(npx, args, { env })

  debug(
    'functions-framework HTTP server is serving %s (entry point %s) on port %d',
    source,
    target,
    port
  )

  debug('child process args %s', JSON.stringify(args, null, 2))

  child.on('kill-functions-framework-process', () => {
    const stdout = execSync(`lsof -i tcp:${port}`).toString()
    debug('processes listening on port %d\n%s', port, stdout)
    const lines = stdout.trim().split('\n').slice(1)
    lines.forEach((line, i) => {
      debug('STDOUT line[%d] %s', i, line.trim())
      const row = line.trim().split(/\s+/)
      const pid = parseInt(row[1])
      const user = row[2]
      // const protocol = row[7]
      const name = row[8]
      // https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=http&page=2
      if (name === '*:http-alt') {
        debug('send SIGTERM to PID %d (user %s)', pid, user)
        process.kill(pid, 'SIGTERM')
      }
    })
  })

  debug(
    'child process PID %d is listening to these events: %s',
    child.pid,
    JSON.stringify(child.eventNames(), null, 2)
  )

  debug('BEFORE waitPort (port %d)', port)
  await waitPort({ host: 'localhost', port })
  debug('AFTER waitPort (port %d)', port)

  return child
}

export const killFunctionsFramework = (
  child: ChildProcessWithoutNullStreams
) => {
  child.emit('kill-functions-framework-process')
  // kill the child process itself
  child.kill('SIGTERM')
}

export const sleep = async (ms: number) => {
  let id: NodeJS.Timeout
  return new Promise<NodeJS.Timeout>((resolve) => {
    id = setTimeout(() => {
      resolve(id)
    }, ms)
  })
}
