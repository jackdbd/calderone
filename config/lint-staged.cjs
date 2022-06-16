// lint-staged is launched from a package's directory, so we need to go 2 levels
// up to find the config files.
const config = {
  '{src,__tests__}/**/*.{js,cjs,mjs,ts}': [
    'prettier --config ../../config/prettier.cjs --write'
  ],
  'src/**/*.{js,cjs,mjs,ts}': ['eslint --config ../../config/eslint.cjs']
}

// console.log('=== lint-staged config ===', config)

module.exports = config
