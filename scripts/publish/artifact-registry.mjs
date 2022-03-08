import fs from 'fs-extra'
import { execSync } from 'node:child_process'
import { writeFile, mkdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import yargs from 'yargs'

const writePackageJSON = async ({ package_root, publish_path }) => {
  const input = path.join(package_root, 'package.json')
  const output = path.join(publish_path, 'package.json')

  const str = await readFile(input, { encoding: 'utf8' })
  // strip all unnecessary fields from the input package.json
  const { devDependencies, scripts, ...package_json } = JSON.parse(str)

  const json = JSON.stringify(package_json, null, 2)
  await writeFile(output, json, { encoding: 'utf-8' })
  return package_json
}

const writeLib = async ({ build_dir, package_root, publish_dir }) => {
  const input = path.join(package_root, build_dir)
  const output = path.join(package_root, publish_dir, build_dir)
  console.log(`build dir: ${input}`)
  console.log(`publish dir: ${output}`)
  await fs.copy(input, output)
}

const DEFAULT = {
  'build-dir': 'lib',
  'keep-build-dir': true,
  'keep-publish-dir': false,
  'package-name': '',
  'publish-dir': 'to-publish'
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['keep-build-dir', 'keep-publish-dir'])
    .describe('package-name', `name of the directory of the package`)
    .describe(
      'build-dir',
      `build directory of the package, relative to the package root`
    )
    .default(DEFAULT).argv

  const package_root = path.resolve('..', argv['package-name'])
  const build_dir = argv['build-dir']
  const build_path = path.join(package_root, build_dir)
  const publish_dir = argv['publish-dir']
  const publish_path = path.join(package_root, publish_dir)

  if (fs.existsSync(publish_path)) {
    await rm(publish_path, { recursive: true, force: true })
  }

  await mkdir(publish_path)

  const package_json = await writePackageJSON({ package_root, publish_path })
  await writeLib({ build_dir, package_root, publish_dir })

  console.log(
    `✈️ package ${package_json.name} version ${package_json.version} ready to be published to Artifact Registry`,
    package_json
  )

  if (argv['dry-run']) {
    console.log(`did not publish because --dry-run was passed`)
  } else {
    const stdout = execSync(`npm publish ./${publish_dir}`).toString().trim()
    console.log(`📦 package ${publish_path} published to Artifact Registry`)
    console.log(stdout)
  }

  if (!argv['keep-build-dir']) {
    await rm(build_path, { recursive: true, force: true })
  }

  if (!argv['keep-publish-dir']) {
    await rm(publish_path, { recursive: true, force: true })
  }
}

main()
