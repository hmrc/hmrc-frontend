if (process.env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK === 'true') {
  process.exit(0);
}
const fs = require('fs');
const path = require('path');

// To our knowledge hmrc-frontend won't work with versions below this.
// This is because of a change to directory structure (/dist/).
const minimumGovukFrontendVersion = '5.1.0';

const projectDir = process.env.INIT_CWD;
const projectPackagePath = path.join(projectDir, 'package.json');

const projectPackageJson = JSON.parse(fs.readFileSync(projectPackagePath, 'utf8'));
const currentVersionInProject = projectPackageJson.dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
if (currentVersionInProject >= minimumGovukFrontendVersion) {
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
