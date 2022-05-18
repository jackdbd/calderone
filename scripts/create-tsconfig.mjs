import path from 'node:path'
import { copyFile } from 'node:fs/promises'
import yargs from 'yargs'
import { monorepoRoot } from './utils.mjs'

const DEFAULT = {
  'package-name': ''
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .alias('p', 'package-name')
    .describe('p', `name of the directory of the package`)
    .help('help')
    .default(DEFAULT).argv

  const package_name = argv['package-name']
  if (package_name === '') {
    throw new Error('--package-name not set')
  }

  const package_root = path.join(monorepoRoot(), 'packages', package_name)

  await copyFile(
    path.join(monorepoRoot(), 'config', 'tsconfig-lib.json'),
    path.join(package_root, 'tsconfig.cloudbuild.json')
  )
}

main()
