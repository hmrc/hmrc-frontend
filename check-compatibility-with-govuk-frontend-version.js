if (process.env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK === 'true') {
  process.exit(0);
}
const fs = require('fs');
const path = require('path');

const projectDir = process.env.INIT_CWD;
const hmrcFrontendDir = path.join(projectDir, 'node_modules/hmrc-frontend/');
const projectPackagePath = path.join(projectDir, 'package.json');
let minimumGovukFrontendVersion = '';

try {
  minimumGovukFrontendVersion = JSON.parse(fs.readFileSync(path.join(hmrcFrontendDir, 'package.json'), 'utf8')).dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
} catch (err) {
  process.exit(0); // Exit if no package.json is found under project_path/node_modules/hmrc-frontend
}

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
