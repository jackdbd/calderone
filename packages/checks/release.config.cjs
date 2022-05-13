const base_config = require('../../config/semantic-release.cjs')
const { git, github } = require('../../config/semantic-release-plugins.cjs')
// const { isPublishingToArtifactRegistry } = require('../../config/utils.cjs')

// let config = {}
// if (isPublishingToArtifactRegistry()) {
//   config = {
//     ...base_config,
//     ci: false,
//     // plugins: [...base_config.plugins, npm]
//     plugins: [...base_config.plugins]
//   }
// } else {
//   config = {
//     ...base_config,
//     ci: true,
//     // The git plugin must be called AFTER the npm plugin. See here:
//     // https://github.com/semantic-release/git#examples
//     // plugins: [...base_config.plugins, npm, github, git]
//     plugins: [...base_config.plugins, github, git('checks')]
//   }
// }

const config = {
  ...base_config,
  ci: true,
  // The git plugin must be called AFTER the npm plugin. See here:
  // https://github.com/semantic-release/git#examples
  // plugins: [...base_config.plugins, npm, github, git]
  plugins: [...base_config.plugins, github, git]
}

module.exports = config
