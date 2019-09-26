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
    // 'prototype-kit': ['1.2.0', '9.2', '9.1', '9.0'], // < Compatible version
    'prototype-kit': ['9.2', '9.1', '9.0'],
    'govuk-frontend': ['3.2', '3.1', '3.0']
  },
  '0.6': {
    // 'prototype-kit': ['1.2.0', '8.12', '8.11', '8.10', '8.9', '8.8', '8.7'], // < Compatible with older version
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
  const compatible = !!compatibility[compatibilityVersion][dependency].find(v => String(parseFloat(v)) === String(parseFloat(version)))
  return { version, compatible }
}

const tableRow = (dependency) => ({
  'Installed version': dependency.version,
  'Compatibility': dependency.compatible
})

console.log(`${styles.green}Checking compatibility for hmrc-frontend v${hmrcFrontendVersion}${styles.reset}`)

const prototypeKitVersion = checkCompatibility('prototype-kit', consumerPackageJson.version)
const govkFrontendVersion = checkCompatibility('govuk-frontend', govukFrontendPackageJson.version)

console.table({
  'Prototype kit': tableRow(prototypeKitVersion),
  'govuk-frontend': tableRow(govkFrontendVersion)
})

if (prototypeKitVersion.compatible) {
  console.log(`${styles.green}Versions are compatible${styles.reset}`, '\n\n\n')
  process.exit(0)
}

if (!prototypeKitVersion.compatible) {
  const { red, green, blue, underline, reset } = styles
  console.log(`${red}Versions are incompatible`, '\n')
  const alternativeVersion = Object.keys(compatibility)
    .filter(version => compatibility[version]['prototype-kit'].includes(prototypeKitVersion.version))

  if (alternativeVersion.length) {
    console.log(
      `${green}There is a compatible version of hmrc-frontend available, you can install it by running \`npm install 'hmrc-frontend@${alternativeVersion[0]}.x'\`${reset}`,
      '\n\n'
    )
  } else {
    console.log(
      `${green}You will need to update to the latest version of the Prototype kit. you can find instructions for doing this at:`
    )
    console.log(
      `${underline}${blue}https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit${reset}`,
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

