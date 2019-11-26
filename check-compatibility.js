
const consumerRoot = process.env.INIT_CWD
const consumerPackageJson = require(`${consumerRoot}/package.json`)
const hmrcFrontendPackageJson = require('./package.json')

const knownPrototypeKitNames = ['govuk-prototype-kit', 'express-prototype']

if (!knownPrototypeKitNames.includes(consumerPackageJson.name)) {
  // Not installing as a dependency of the prototype kit so silently exit and continue
  process.exit(0)
}

const compatibility = {
  '1.4': {
    'prototype-kit': ['9.4', '9.3', '9.2', '9.1', '9.0']
  },
  '0.6': {
    'prototype-kit': ['8.12', '8.11', '8.10', '8.9', '8.8', '8.7']
  }
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
readline.on('close', () => process.exit(1))

const blue = '\x1b[36m'
const green = '\x1b[32m'
const underline = '\x1b[4m'
const reset = '\x1b[0m'

const hmrcFrontendVersion = hmrcFrontendPackageJson.version
const compatibilityVersion = Object.keys(compatibility)
  .filter(version => parseFloat(version) < parseFloat(hmrcFrontendVersion))[0]

const checkCompatibility = (dependency, version) => {
  const getMatchableVersion = (v) => String(parseFloat(v).toFixed(1))
  const versionMatcher = getMatchableVersion(version)
  const compatible = !!compatibility[compatibilityVersion][dependency].find(v => getMatchableVersion(v) === versionMatcher)
  return { version, compatible, versionMatcher }
}

const styleString = (str, colour = green, style = '') => `${colour}${style}${str}${reset}`

const prototypeKitVersion = checkCompatibility('prototype-kit', consumerPackageJson.version)

if (prototypeKitVersion.compatible) {
  process.exit(0)
}

if (!prototypeKitVersion.compatible) {
  const alternativeVersion = Object.keys(compatibility)
    .filter(version => compatibility[version]['prototype-kit'].includes(prototypeKitVersion.versionMatcher))

  if (alternativeVersion.length) {
    console.log(
      styleString('The version of HMRC Frontend you are trying to install is not compatible with your version of the GOV.UK Prototype Kit.'),
      '\n\n'
    )
    console.log('You can install a compatible version by typing', '\n\n')

    console.log('┌─────────────────────────────────┐')
    console.log(`| npm install hmrc-frontend@${alternativeVersion[0]}.x |`)
    console.log('└─────────────────────────────────┘', '\n\n')
    process.exit(1)
  } else {
    console.log(styleString('Your prototype is not compatible with HMRC Frontend'), '\n\n')
    console.log('You are using an old version of the GOV.UK Prototype Kit. This means it is not compatible with HMRC Frontend. You need to update to the latest version of the GOV.UK Prototype Kit.', '\n\n')
    console.log('Find out more about updating your GOV.UK prototype')
    console.log(styleString('https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit', blue, underline), '\n\n')
    readline.question('You can continue to install HMRC Frontend, but your prototype may look different or some features may not work. Do you want to continue? (y/n) ', (answer) => {
      console.log('\n\n')
      if (answer[0].toLowerCase() === 'y') {
        process.exit(0)
      } else {
        process.exit(1)
      }
    })
  }
}
