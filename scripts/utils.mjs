import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import ini from 'ini'

export const monorepoRoot = () => {
  let current_dir = path.resolve('.')
  while (!fs.existsSync(path.join(current_dir, '.git'))) {
    current_dir = path.join(current_dir, '..')
  }
  // console.log(`monorepo root: ${current_dir}`)
  return current_dir
}

/**
 * Parse a .npmrc credential config file and retrieve the auth token for an
 * Artifact Registry npm repository.
 */
export const artifactRegistryAuthToken = async ({
  location_id,
  npmrc_credential_config,
  project_id,
  repo_id
}) => {
  const str = await readFile(npmrc_credential_config, { encoding: 'utf-8' })
  const config = ini.parse(str)
  const key = `//${location_id}-npm.pkg.dev/${project_id}/${repo_id}/:_authToken`
  return config[key]
}

export const writeArtifactRegistryAuthToken = async ({
  location_id,
  npmrc_filepath,
  project_id,
  repo_id,
  token
}) => {
  const str = await readFile(npmrc_filepath, { encoding: 'utf-8' })
  const config = ini.parse(str)
  const key = `//${location_id}-npm.pkg.dev/${project_id}/${repo_id}/:_authToken`
  config[key] = token
  await writeFile(npmrc_filepath, ini.stringify(config))
}

/**
 * Take an input package.json and write a new package.json stripped of all those
 * fields which are not necessary for a library.
 */
export const writePackageJsonForLibrary = async ({
  package_root,
  publish_path
}) => {
  const input = path.join(package_root, 'package.json')
  const output = path.join(publish_path, 'package.json')

  const str = await readFile(input, { encoding: 'utf8' })

  const { devDependencies, keywords, scripts, ...package_json } =
    JSON.parse(str)

  const json = JSON.stringify(package_json, null, 2)
  await writeFile(output, json, { encoding: 'utf-8' })
  return package_json
}

/**
 * Take an input package.json and write a new package.json stripped of all those
 * fields which are not necessary for an application.
 */
export const writePackageJsonForApplication = async ({
  package_root,
  publish_path
}) => {
  const input = path.join(package_root, 'package.json')
  const output = path.join(publish_path, 'package.json')

  const str = await readFile(input, { encoding: 'utf8' })

  const {
    devDependencies,
    exports,
    keywords,
    peerDependencies,
    scripts,
    typesVersions,
    version,
    ...input_package_json
  } = JSON.parse(str)

  const sha = execSync('git rev-parse --short HEAD').toString().trim()

  const package_json = {
    ...input_package_json,
    scripts: {
      start: 'node main.js'
    },
    version: `sha:${sha}`
  }

  const json = JSON.stringify(package_json, null, 2)
  await writeFile(output, json, { encoding: 'utf-8' })
  return package_json
}

export const writePackageJsonForCloudFunctions = async ({
  package_root,
  publish_path
}) => {
  const input = path.join(package_root, 'package.json')
  const output = path.join(publish_path, 'package.json')

  const str = await readFile(input, { encoding: 'utf8' })

  const {
    devDependencies,
    exports,
    keywords,
    peerDependencies,
    scripts,
    typesVersions,
    version,
    ...input_package_json
  } = JSON.parse(str)

  const sha = execSync('git rev-parse --short HEAD').toString().trim()

  const package_json = {
    ...input_package_json,
    scripts: {
      start: 'functions-framework --source main.js --target entryPoint'
    },
    version: `sha:${sha}`
  }

  const json = JSON.stringify(package_json, null, 2)
  await writeFile(output, json, { encoding: 'utf-8' })
  return package_json
}