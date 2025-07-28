if (process.env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK === 'true') {
  process.exit(0);
}
const fs = require('fs');
const path = require('path');

// To our knowledge hmrc-frontend won't work with versions below this.
const minimumGovukFrontendVersion = '5.4.0';

function semverGreaterThan(a, b) {
  const [aMaj, aMin, aPat] = a.split('.').map(Number);
  const [bMaj, bMin, bPat] = b.split('.').map(Number);
  return ((aMaj - bMaj) || (aMin - bMin) || (aPat - bPat)) > 0;
}

const projectDir = process.env.INIT_CWD;
const projectPackagePath = path.join(projectDir, 'package.json');

const projectPackageJson = JSON.parse(fs.readFileSync(projectPackagePath, 'utf8'));

try {
  projectPackageJson.dependencies['govuk-prototype-kit'].replace(/[^0-9.]/g, '');
} catch (err) {
  process.exit(0); // Exit if govuk-prototype-kit is not found in package.json
}

const currentVersionInProject = projectPackageJson.dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
if (semverGreaterThan(currentVersionInProject, minimumGovukFrontendVersion)) {
  process.exit(0);
} else {
  // eslint-disable-next-line no-console
  process.stderr.write(`
  Hello friend, looks like you're on
  govuk-frontend v${currentVersionInProject}, 
  but hmrc-frontend requires at least v${minimumGovukFrontendVersion}.
  This error is just a heads up that hmrc-frontend might not
  work as intended on your current version.
    - PlatUI
  -------------------------------------------
          \\   ^__^ 
           \\  (oo)_______
              (__)       )\\/\\
                  ||----w |
                  ||     ||
  - PlatMooI the PlatUI Helper Cow
  `);

  process.exit(1);
}
