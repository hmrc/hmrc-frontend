// prototypes load and compile a subset of hmrc-frontend styles using their
// own version of govuk-frontend, if their version of govuk-frontend is
// lower than 5.4.0 then the compilation of styles will fail with an error
// that can be hard for interaction designers to debug, we would like to
// give them a warning on installation so that they don't get stuck later
// when trying to use the hmrc-frontend styles.
const fs = require('fs');
const path = require('path');

function hmrcFrontendDisableCompatibilityCheck() {
  return process.env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK === 'true';
}

function semverGreaterThanOrEqualTo(a, b) {
  const [aMaj, aMin, aPat] = a.split('.').map(Number);
  const [bMaj, bMin, bPat] = b.split('.').map(Number);
  return ((aMaj - bMaj) || (aMin - bMin) || (aPat - bPat)) >= 0;
}

function withinPrototypeKitAndUsingIncompatibleGovukFrontendVersion() {
  const projectDir = process.env.INIT_CWD || process.cwd();
  const projectPackagePath = path.join(projectDir, 'package.json');
  const projectPackageJson = JSON.parse(fs.readFileSync(projectPackagePath, 'utf8'));

  if (
    !projectPackageJson.dependencies
    || !projectPackageJson.dependencies['govuk-frontend']
    || !projectPackageJson.dependencies['govuk-prototype-kit']
  ) {
    process.exit(0);
  }

  const currentVersionInProject = projectPackageJson.dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
  const minimumGovukFrontendVersion = '5.4.0';

  if (!semverGreaterThanOrEqualTo(currentVersionInProject, minimumGovukFrontendVersion)) {
    // eslint-disable-next-line no-console
    process.stderr.write(`
    Hello friend, looks like you're on
    govuk-frontend v${currentVersionInProject}, 
    but hmrc-frontend requires at least v5.4.0.
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
    return true;
  }
  return false;
}

try {
  if (hmrcFrontendDisableCompatibilityCheck()) {
    process.exit(0);
  }
  if (withinPrototypeKitAndUsingIncompatibleGovukFrontendVersion()) {
    process.exit(1);
  } else {
    process.exit(0);
  }
} catch (err) {
  process.exit(0);
}
