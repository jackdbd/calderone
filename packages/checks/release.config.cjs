const base_config = require('../../config/semantic-release.cjs')
const {
  isPublishingToArtifactRegistry,
  changelogPlugin,
  npmPlugin,
  packageRoot
} = require('../../config/utils.cjs')

const package_root = packageRoot('checks')

let config = {}
if (isPublishingToArtifactRegistry()) {
  console.log(`=== publish ${package_root} to Artifact Registry ===`)
  config = {
    ...base_config,
    ci: false,
    plugins: [
      ...base_config.plugins,
      changelogPlugin(package_root),
      npmPlugin(package_root)
      // gitPlugin(package_root)
    ]
  }
} else {
  config = {
    ...base_config,
    // plugins: [...base_config.plugins, npm_plugin, github_plugin, git_plugin]
    plugins: [...base_config.plugins]
  }
}

module.exports = config
