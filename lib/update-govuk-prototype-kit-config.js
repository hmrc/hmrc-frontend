const path = require('path');
const fs = require('fs');

const projectDir = path.dirname(__dirname);
const govukFrontendVersion = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8')).dependencies['govuk-frontend'].replace(/[^0-9.]/g, '');
const govukPrototypeKitConfigPath = path.join(projectDir, 'src', 'govuk-prototype-kit.config.json');
const govukPrototypeKitConfig = JSON.parse(fs.readFileSync(govukPrototypeKitConfigPath, 'utf8'));
govukPrototypeKitConfig.pluginDependencies = [
  {
    packageName: 'govuk-frontend',
    minVersion: govukFrontendVersion,
  },
];
fs.writeFileSync(govukPrototypeKitConfigPath, JSON.stringify(govukPrototypeKitConfig, null, 2));
