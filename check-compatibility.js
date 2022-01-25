const consumerRoot = process.env.INIT_CWD;
const fs = require('fs');
const readlinePkg = require('readline');
const hmrcFrontendPackageJson = require('./package.json');

const consumerPackageJson = JSON.parse(fs.readFileSync(`${consumerRoot}/package.json`));
const withManualSteps = 'withManualSteps';

const knownPrototypeKitNames = ['govuk-prototype-kit', 'express-prototype'];

if (!knownPrototypeKitNames.includes(consumerPackageJson.name)) {
  // Not installing as a dependency of the prototype kit so silently exit and continue
  process.exit(0);
}

const compatibility = {
  4.1: {
    'prototype-kit': ['12.0', '11.0', '10.0', '9.15', '9.14', '9.13', '9.12', '9.11', '9.10', '9.9', '9.8', '9.7', '9.6', '9.5', '9.4', '9.3', '9.2', '9.1', '9.0'],
  },
  3.3: {
    'prototype-kit': ['12.0', '11.0', '10.0', '9.15', '9.14', '9.13', '9.12', '9.11', '9.10', '9.9', '9.8', '9.7', '9.6', '9.5', '9.4', '9.3', '9.2', '9.1', '9.0'],
  },
  1.38: {
    'prototype-kit': ['12.0', '11.0', '10.0', '9.15', '9.14', '9.13', '9.12', '9.11', '9.10', '9.9', '9.8', '9.7', '9.6', '9.5', '9.4', '9.3', '9.2', '9.1', '9.0'],
  },
  0.6: {
    'prototype-kit': ['8.12', '8.11', '8.10', '8.9', '8.8', '8.7'],
  },
  [`0.6${withManualSteps}`]: {
    'prototype-kit': ['8.6', '8.5', '8.4', '8.3', '8.2', '8.1', '8.0', '7.1', '7.0'],
  },
};

const readline = readlinePkg.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.on('close', () => process.exit(1));

const blue = '\x1b[36m';
const red = '\x1b[31m';
const underline = '\x1b[4m';
const reset = '\x1b[0m';

const hmrcFrontendVersion = hmrcFrontendPackageJson.version;

const checkCompatibility = (version, host = 'prototype-kit') => {
  const getMatchableVersion = (v) => parseFloat(v).toFixed(1);

  const installingHmrcVersion = String(getMatchableVersion(hmrcFrontendVersion));
  const compatibilityMatch = compatibility[installingHmrcVersion];
  if (!compatibilityMatch) {
    console.warn('The version couldn\'t be matched, compatibility couldn\'t be checked');
    process.exit(0);
  }
  const latestKnownHost = compatibilityMatch[host][0];
  const hostVersion = String(getMatchableVersion(version));

  const compatible = compatibilityMatch[host].includes(hostVersion)
    || parseFloat(hostVersion) > parseFloat(latestKnownHost);
  let alternativeVersion = !compatible && Object.keys(compatibility)
    .find((hmrcVersion) => compatibility[hmrcVersion][host].includes(hostVersion));

  let requiresManualSteps = false;
  if (alternativeVersion && alternativeVersion.includes(withManualSteps)) {
    alternativeVersion = alternativeVersion.replace(withManualSteps, '');
    requiresManualSteps = true;
  }

  return {
    version, compatible, alternativeVersion, requiresManualSteps,
  };
};

const styleString = (str, colour = red, style = '') => `${colour}${style}${str}${reset}`;

const {
  alternativeVersion, compatible, requiresManualSteps,
} = checkCompatibility(consumerPackageJson.version);

if (compatible) {
  process.exit(0);
}

if (!compatible) {
  if (alternativeVersion && requiresManualSteps) {
    console.log(
      styleString('The version of HMRC Frontend you are trying to install is not compatible with your version of the GOV.UK Prototype Kit.'),
      '\n\n',
    );

    console.log('You can install a compatible version by following the steps detailed below');
    console.log(
      styleString('https://design.tax.service.gov.uk/hmrc-design-patterns/install-hmrc-frontend-in-your-prototype/install-hrmc-frontend-in-an-old-version-of-the-govuk-prototype-kit/', blue, underline),
      '\n\n',
    );

    process.exit(1);
  } else if (alternativeVersion) {
    console.log(
      styleString('The version of HMRC Frontend you are trying to install is not compatible with your version of the GOV.UK Prototype Kit.'),
      '\n\n',
    );
    console.log('You can install a compatible version by typing', '\n\n');

    console.log('┌─────────────────────────────────┐');
    console.log(`| npm install hmrc-frontend@${alternativeVersion}.x |`);
    console.log('└─────────────────────────────────┘', '\n\n');

    process.exit(1);
  } else {
    console.log(styleString('Your prototype is not compatible with HMRC Frontend'), '\n\n');
    console.log('You are using an old version of the GOV.UK Prototype Kit. This means it is not compatible with HMRC Frontend. You need to update to the latest version of the GOV.UK Prototype Kit.', '\n\n');
    console.log('Find out more about updating your GOV.UK prototype');
    console.log(styleString('https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit', blue, underline), '\n\n');

    if (process.env.allowIncompatible) {
      const acceptPrompt = (response) => process.exit((response === 'y') ? 0 : 1);
      if (process.env.atPrompt) {
        acceptPrompt(process.env.atPrompt);
      } else {
        readline.question('You can continue to install HMRC Frontend, but your prototype may look different or some features may not work. Do you want to continue? (y/n) ', (answer) => {
          console.log('\n\n');
          acceptPrompt(answer[0].toLowerCase());
        });
      }
    } else {
      process.exit(1);
    }
  }
}
