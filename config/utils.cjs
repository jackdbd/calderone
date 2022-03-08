/**
 * Message to be used by the semantic-release git plugin when creating a release
 * commit. It's defined here so all packages use a consistent release message.
 */
const releaseMessage = () => {
  return 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
}

// const isPublishingToArtifactRegistry = () => true
const isPublishingToArtifactRegistry = () => false

module.exports = {
  isPublishingToArtifactRegistry,
  releaseMessage
}
