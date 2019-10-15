const consumerRoot = process.env.INIT_CWD
const consumerPackageJson = require(`${consumerRoot}/package.json`)
const hmrcFrontendPackageJson = require('./package.json')

const knownPrototypeKitNames = ['govuk-prototype-kit', 'express-prototype']

if (!knownPrototypeKitNames.includes(consumerPackageJson.name)) {
  // Not installing as a dependency of the prototype kit so silently exit and continue
  process.exit(0)
}

const compatibility = {
  '1.0': {
    'prototype-kit': ['9.2', '9.1', '9.0']
  },
  '0.6': {
    'prototype-kit': ['8.12', '8.11', '8.10', '8.9', '8.8', '8.7']
  }
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const blue = '\x1b[36m'
const yellow = '\x1b[33m'
const green = '\x1b[32m'
const red = '\x1b[31m'
const underline = '\x1b[4m'
const reset = '\x1b[0m'

const hmrcFrontendVersion = hmrcFrontendPackageJson.version
const compatibilityVersion = Object.keys(compatibility)
  .filter(version => parseFloat(version) < parseFloat(hmrcFrontendVersion))[0]

const checkCompatibility = (dependency, version) => {
  const versionMatcher = String(parseFloat(version))
  const compatible = !!compatibility[compatibilityVersion][dependency].find(v => String(parseFloat(v)) === versionMatcher)
  return { version, compatible, versionMatcher }
}

const tableRow = (dependency) => ({
  'Installed version': dependency.version,
  'Compatibility': dependency.compatible
})

const styleString = (str, colour = green, style = '') => `${colour}${style}${str}${reset}`

console.log(styleString(`Checking compatibility for hmrc-frontend v${hmrcFrontendVersion}`))

const prototypeKitVersion = checkCompatibility('prototype-kit', consumerPackageJson.version)

console.table({
  'GOV.UK Prototype kit': tableRow(prototypeKitVersion)
})

if (prototypeKitVersion.compatible) {
  console.log(styleString('Versions are compatible'), '\n\n\n')
  process.exit(0)
}

if (!prototypeKitVersion.compatible) {
  console.log(styleString('Versions are incompatible', red), '\n')
  const alternativeVersion = Object.keys(compatibility)
    .filter(version => compatibility[version]['prototype-kit'].includes(prototypeKitVersion.versionMatcher))

  if (alternativeVersion.length) {
    console.log(
      styleString(`There is a compatible version of hmrc-frontend available, you can install it by running \`npm install hmrc-frontend@${alternativeVersion[0]}.x\``),
      '\n\n'
    )
    process.exit(1)
  } else {
    console.log(styleString('You will need to update to the latest version of the Prototype kit. you can find instructions for doing this at:'))
    console.log(styleString('https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit', blue, underline), '\n\n')
    readline.question(styleString('You can continue with this install but some features may break or not work as expected. Would you like to continue? (y/n) ', yellow), (answer) => {
      if (answer[0].toLowerCase() === 'y') {
        process.exit(0)
      } else {
        process.exit(1)
      }
    })
  }
}
