import fs from 'node:fs'
import { cp } from 'node:fs/promises'
import path from 'node:path'
import makeDebug from 'debug'
import esbuild from 'esbuild'
import yargs from 'yargs'
import { monorepoRoot } from '../utils/lib/path.js'

const debug = makeDebug('scripts/build-scripts')

const entryPoints = (subdir) => {
  const names = fs.readdirSync(path.join('src', subdir))
  return names.map((name) => path.join('src', subdir, name))
}

const config = ({
  subdir,
  minify = false,
  sourcemap = undefined,
  watch = false
}) => {
  const commonOptions = {
    bundle: true,
    logLevel: 'info',
    minify,
    platform: 'node',
    // https://esbuild.github.io/api/#sourcemap
    sourcemap: false,
    target: 'node16',
    tsconfig: 'tsconfig.json'
  }

  return {
    ...commonOptions,
    entryPoints: entryPoints(subdir),
    outdir: path.join('dist', subdir),
    watch
  }
}

const DEFAULT = {
  watch: false
}

const copyProtos = async () => {
  const dest = path.join(monorepoRoot(), 'packages', 'scripts', 'protos')

  if (fs.existsSync(dest)) {
    debug(`remove protos at ${dest}`)
    fs.rmSync(dest, { recursive: true, force: true })
  }

  const src = path.join(
    monorepoRoot(),
    'node_modules',
    '@google-cloud',
    'monitoring',
    'build',
    'protos'
  )

  debug(`copy protos: ${src} => ${dest}`)
  await cp(src, dest, { recursive: true, force: true })
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['watch'])
    .default(DEFAULT).argv

  const subdirs = fs.readdirSync('src')

  if (argv.watch) {
    // https://esbuild.github.io/api/#watch
    const onRebuild = async (error, result) => {}
    const promises = subdirs.map((subdir) => {
      debug(`build ${subdir} scripts (watch)`)
      return esbuild.build(config({ subdir, watch: { onRebuild } }))
    })
    await Promise.all(promises)
    await copyProtos()
  } else {
    const promises = subdirs.map((subdir) => {
      debug(`build ${subdir} scripts`)
      return esbuild.build(config({ subdir, minify: true }))
    })
    await Promise.all(promises)
    await copyProtos()
  }
}

main()
