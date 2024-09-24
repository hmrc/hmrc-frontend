const configPaths = require('./config/paths.json');

module.exports = {
  browserContext: 'incognito',

  launch: {
    args: [
      '--no-startup-window',
      // the following two options are necessary to use browsers in jenkins
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],

    headless: process.env.HEADLESS !== 'false' ? 'new' : false,

    devtools: process.env.DEVTOOLS === 'true',

    waitForInitialPage: false,
  },

  server: {
    command: 'node app/start.js',
    port: configPaths.ports.app,
    launchTimeout: 30000,
    usedPortAction: 'ignore',
  },
};
