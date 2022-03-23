// https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional
const config = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (message) => {
      return message.includes('initial commit') || message.includes('WIP')
    }
  ],
  // https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
  rules: {
    // I configured semantic-release git plugin to create a release commit
    // message containing release notes in the commit body. This would exceed
    // the limit set by the config-conventional preset. So I override the rule.
    'body-max-line-length': [2, 'always', Infinity]
  }
}

// As a reminder, a convential commit message has the following structure:
//////////////////////////
// type(scope): subject //
//////////////////////////
// type must be one of:
// - build
// - chore
// - ci
// - docs
// - feat (triggers a MINOR release)
// - fix (triggers a PATCH release)
// - perf
// - refactor
// - revert
// - style
// - test
// TODO: what about a type of BREAKING CHANGE?

module.exports = config
