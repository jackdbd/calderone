import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { copyFile, rm, mkdir } from 'node:fs/promises'
import fsExtra from 'fs-extra'
import { env } from 'node:process'
import path from 'node:path'
import yargs from 'yargs'
import {
  artifactRegistryAuthToken,
  monorepoRoot,
  writeArtifactRegistryAuthToken,
  writePackageJsonForLibrary
} from '../utils.mjs'

const cp = fsExtra.promises.cp

const DEFAULT = {
  'build-dir': 'lib',
  'dry-run': false,
  'keep-publish-dir': false,
  'package-name': ''
}

const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .boolean(['dry-run', 'keep-publish-dir'])
    .describe(
      'build-dir',
      `build directory of the package, relative to the package root`
    )
    .describe('dry-run', 'do not actually publish to Artifact Registry')
    .describe(
      'keep-publish-dir',
      'if true, do not remove the directory used for publishing the package'
    )
    .describe('package-name', `name of the directory of the package`)
    .default(DEFAULT).argv

  const package_root = path.resolve('..', argv['package-name'])
  const build_path = path.join(package_root, argv['build-dir'])

  const publish_path = path.join(package_root, 'to-publish')
  if (existsSync(publish_path)) {
    await rm(publish_path, { recursive: true, force: true })
  }

  await mkdir(publish_path)
  await cp(build_path, path.join(publish_path, argv['build-dir']), {
    recursive: true,
    force: true
  })

  const package_json = await writePackageJsonForLibrary({
    package_root,
    publish_path
  })

  console.log(
    `publish package ${package_json.name} from ${publish_path} (vers. ${package_json.version})`
  )
  console.log(package_json)

  const npmrc_credential_config = path.join(env.HOME, '.npmrc')
  const npmrc_repo_config = path.join(monorepoRoot(), '.npmrc')
  const npmrc_library = path.join(publish_path, '.npmrc')

  await copyFile(npmrc_repo_config, npmrc_library)
  console.log(`${npmrc_repo_config} => ${npmrc_library}`)

  execSync(
    `npx google-artifactregistry-auth --repo-config ${npmrc_repo_config} --credential-config ${npmrc_credential_config}`
  )
  console.log(`npm auth tokens refreshed in ${npmrc_credential_config}`)

  const location_id = env.ARTIFACT_REGISTRY_NPM_REPOSITORY_LOCATION
  const project_id = env.GCP_PROJECT_ID
  const repo_id = env.ARTIFACT_REGISTRY_NPM_REPOSITORY_ID

  const token = await artifactRegistryAuthToken({
    location_id,
    project_id,
    npmrc_credential_config,
    repo_id
  })

  await writeArtifactRegistryAuthToken({
    location_id,
    project_id,
    npmrc_filepath: npmrc_library,
    repo_id,
    token
  })
  console.log(`Artifact Registry auth token written to ${npmrc_library}`)

  let cmd
  if (argv['dry-run']) {
    console.log(
      `📦 these files WOULD be published to Artifact Registry, but they are not because of --dry-run`
    )
    cmd = `cd ${publish_path} && npm publish . --dry-run`
  } else {
    console.log(`📦 these files WILL be published to Artifact Registry`)
    cmd = `cd ${publish_path} && npm publish .`
  }

  const stdout = execSync(cmd).toString().trim()
  console.log(stdout)

  if (!argv['keep-publish-dir']) {
    await rm(publish_path, { recursive: true, force: true })
  }
}

main()
