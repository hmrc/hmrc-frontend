const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const appListen = require('./appListen');

const configPaths = require('../../config/paths.json');

const PORT = configPaths.ports.test;

const DIR = path.join(os.tmpdir(), 'jest-puppeteer-global-setup');

module.exports = async () => {
  console.log(chalk.green('\nStart Server'));
  global.__SERVER__ = await appListen(PORT);
  console.log(`Server started at http://localhost:${PORT}`);
  console.log(chalk.green('Setup Puppeteer'));
  // we use --no-sandbox --disable-setuid-sandbox as a workaround for the
  // 'No usable sandbox! Update your kernel' error
  // see more https://github.com/Googlechrome/puppeteer/issues/290
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  global.__BROWSER__ = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
