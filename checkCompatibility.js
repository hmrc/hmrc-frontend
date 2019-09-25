const consumerRoot = process.argv[2]
const consumerPackageJson = require(`${consumerRoot}/package.json`)

const govukFrontendPackageJson = require(`${consumerRoot}/node_modules/govuk-frontend/package.json`)
const hmrcFrontendPackageJson = require('./package.json')

if (consumerPackageJson.name === !hmrcFrontendPackageJson.name) {
  console.log('Not installing as a dependency')
  process.exit(0)
}

const compatibility = {
  '1.0': {
    'prototype-kit': ['9.2', '9.1', '9.0'],
    'govuk-frontend': ['3.2', '3.1', '3.0']
  },
  '0.6': {
    'prototype-kit': ['8.12', '8.11', '8.10', '8.9', '8.8', '8.7'],
    'govuk-frontend': ['2.13', '2.12', '2.11', '2.10', '2.9', '2.8']
  }
}

const styles = {
  blue: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  underline: '\x1b[4m',
  reset: '\x1b[0m'
}

const hmrcFrontendVersion = hmrcFrontendPackageJson.version
const compatibilityVersion = Object.keys(compatibility)
  .filter(version => parseFloat(version) < parseFloat(hmrcFrontendVersion))[0]

const checkCompatibility = (dependency, version) => {
  const isCompatible = compatibility[compatibilityVersion][dependency].find(v => v === String(parseFloat(version)))
  return { 'Installed Version': version, 'Compatibility': !!isCompatible }
}

console.log(styles.green, `Checking compatibility for hmrc-frontend v${hmrcFrontendVersion}`, styles.reset)

const prototypeKitVersion = checkCompatibility('prototype-kit', consumerPackageJson.version)
const govkFrontendVersion = checkCompatibility('govuk-frontend', govukFrontendPackageJson.version)

console.table({
  'Prototype kit': prototypeKitVersion,
  'govuk-frontend': govkFrontendVersion
})

if (prototypeKitVersion.Compatibility) {
  console.log(styles.green, 'Versions are compatible', '\n\n\n', styles.reset)
  process.exit(0)
}

if (!prototypeKitVersion.Compatibility) {
  console.log(styles.red, 'Versions are incompatible', '\n')
  const alternativeVersion = Object.keys(compatibility)
    .filter(version => compatibility[version]['prototype-kit'].includes(String(parseFloat(prototypeKitVersion['Installed Version']))))

  if (alternativeVersion.length) {
    console.log(
      styles.green,
      `There is a compatible version of hmrc-frontend available, you can install it by running \`npm install 'hmrc-frontend@${alternativeVersion[0]}.x'\``,
      '\n\n',
      styles.reset
    )
  } else {
    console.log(
      styles.green,
      'You will need to update to the latest version of the Prototype kit. you can find instructions for doing this at:',
      styles.blue
    )
    console.log(
      styles.underline,
      'https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit',
      styles.reset,
      '\n\n'
    )
  }

  process.exit(1)
}

/*
HMRC versions:
1.2.0 - latest and compatible with current HMRC and GOVUK design system, govuk-frontend 3.0.0 onwards, and current prototype kit
0.6.0 - previous alpha release, compatible with govuk-frontend pre- 3.0.0 and prototype kit < 9.0.0

GOVK versions:
3.2.0 - latest release compatible with GOVUK design system and latest prototype kit
3.0.0 - Breaking change, killer of hmrc-frontend pre- 1.0.0
2.13.0 - Compatible with hmrc-frontend < 1.0.0 and prototype kit < 9.0.0

Prototype kit versions:
9.2.0 - latest
9.0.0 - breaking changes - requires govuk-frontend > 3.0.0 and hmrc-frontend > 1.0.0
8.12.1 - compatible with previous versions of govuk-frontend and hmrc-frontend

*/

