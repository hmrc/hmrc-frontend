const chalk = require('chalk');
const gulp = require('gulp');
const backstop = require('backstopjs');
const appListen = require('../../lib/puppeteer/appListen');
const configPaths = require('../../config/paths.json');
const backstopConfig = require('./backstop-config');

const port = configPaths.ports.test;
const docker = !process.env.CI;
const host = docker ? 'host.docker.internal' : 'localhost';
const config = backstopConfig({ host, port });
const options = { config, docker };

const runBackstop = (command) => backstop(command, options);

gulp.task('backstop:approve', () => runBackstop('approve'));

gulp.task('backstop-test', async () => {
  console.log(chalk.green('\nStart server for visual regression testing'));
  const server = await appListen(port);
  console.log(chalk.green(`\nServer started at http://${host}:${port}`));

  try {
    console.log(chalk.green('\nPerforming visual regression testing'));
    await runBackstop('test');
  } finally {
    console.log(chalk.green('\nClose server for visual regression testing'));
    await server.close();
  }
});
