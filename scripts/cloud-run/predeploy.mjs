import { execSync } from 'node:child_process'
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { env } from 'node:process'
import yargs from 'yargs'
import {
  artifactRegistryAuthToken,
  monorepoRoot,
  writeArtifactRegistryAuthToken,
  writePackageJsonForApplication
} from '../utils.mjs'

const DEFAULT = {
  'build-dir': 'dist',
  debug: false,
  'package-name': ''
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .describe(
      'build-dir',
      `build directory of the package, relative to the package root`
    )
    .alias('p', 'package-name')
    .describe('p', `name of the directory of the package`)
    .help('help')
    .default(DEFAULT).argv

  const package_name = argv['package-name']
  if (package_name === '') {
    throw new Error('--package-name not set')
  }

  const package_root = path.join(monorepoRoot(), 'packages', package_name)
  const build_path = path.join(package_root, argv['build-dir'])

  const package_json = await writePackageJsonForApplication({
    package_root,
    publish_path: build_path
  })

  if (argv.debug) {
    console.log(
      `package ${package_json.name} vers. ${package_json.version} built in ${build_path}`
    )
    console.log(package_json)
  }

  // const npmrc_credential_config = path.join(env.HOME, '.npmrc')
  // const npmrc_repo_config = path.join(monorepoRoot(), '.npmrc')
  // const npmrc_app = path.join(build_path, '.npmrc')

  // await copyFile(npmrc_repo_config, npmrc_app)
  // console.log(`${npmrc_repo_config} => ${npmrc_app}`)

  // execSync(
  //   `npx google-artifactregistry-auth --repo-config ${npmrc_repo_config} --credential-config ${npmrc_credential_config}`
  // )
  // console.log(`npm auth tokens refreshed in ${npmrc_credential_config}`)

  // const location_id = env.ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION
  // const project_id = env.GCP_PROJECT_ID
  // const repo_id = env.ARTIFACT_REGISTRY_NPM_REPOSITORY_ID

  // const token = await artifactRegistryAuthToken({
  //   location_id,
  //   project_id,
  //   npmrc_credential_config,
  //   repo_id
  // })

  // await writeArtifactRegistryAuthToken({
  //   location_id,
  //   project_id,
  //   npmrc_filepath: npmrc_app,
  //   repo_id,
  //   token
  // })
  // console.log(`Artifact Registry auth token written to ${npmrc_app}`)
}

main()
