const fs = require('fs');
const path = require('path');

const projectDir = process.env.INIT_CWD;
const hmrcFrontendDir = path.join(projectDir, 'node_modules/hmrc-frontend/');
let govukFrontendVersion = '';

try {
  govukFrontendVersion = JSON.parse(fs.readFileSync(path.join(hmrcFrontendDir, 'package.json'), 'utf8')).dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
} catch (err) {
  process.exit(0); // Exit if no package.json is found under project_path/node_modules/hmrc-frontend
}

const govukPrototypeKitPackagePath = path.join(projectDir, 'package.json');
const govukPrototypeKitConfig = JSON.parse(fs.readFileSync(govukPrototypeKitPackagePath, 'utf8'));
const currentGovukFrontendVersion = govukPrototypeKitConfig.dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
if (currentGovukFrontendVersion >= govukFrontendVersion) {
  process.exit(0);
} else {
  govukPrototypeKitConfig.dependencies['govuk-frontend'] = govukFrontendVersion;
  // eslint-disable-next-line no-console
  console.warn(`
  Hello friend, looks like you're on
  govuk-frontend v${currentGovukFrontendVersion}, 
  but hmrc-frontend requires at least v${govukFrontendVersion}.
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
