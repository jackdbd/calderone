import fs from 'node:fs'
import path from 'node:path'
import esbuild from 'esbuild'
import yargs from 'yargs'

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

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['watch'])
    .default(DEFAULT).argv

  const subdirs = fs.readdirSync('src')

  if (argv.watch) {
    // https://esbuild.github.io/api/#watch
    // const onRebuild = async (error, result) => {}
    // const promises = subdirs.map((subdir) => {
    //   return esbuild.build(config({ subdir, watch: { onRebuild } }))
    // })
    const promises = subdirs.map((subdir) => {
      return esbuild.build(config({ subdir, watch: true }))
    })
    await Promise.all(promises)
  } else {
    const common = {
      minify: true,
      sourcemap: true
    }
    subdirs.forEach((subdir) => {
      return esbuild.buildSync(config({ ...common, subdir }))
    })
  }
}

main()
