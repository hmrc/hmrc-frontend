const { argv } = require('yargs');
const configPaths = require('../../config/paths.json');

// Dist directory does not need to be namespaced with `hmrc`
const destinationPath = (argv.destination === 'package'
  ? `${configPaths.package}hmrc/`
  : configPaths.dist);

module.exports = destinationPath;
