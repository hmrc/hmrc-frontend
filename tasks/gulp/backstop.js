const chalk = require('chalk');
const gulp = require('gulp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const backstop = require('backstopjs');
const configPaths = require('../../config/paths.json');
const backstopConfig = require('./backstop-config');
const app = require('../../app/app')({ nunjucks: { watch: false } });

const port = configPaths.ports.test;
const docker = !process.env.CI;
const defaultHost = docker ? 'host.docker.internal' : 'localhost';
const host = process.env.BACKSTOP_TEST_HOST || defaultHost;
const components = glob.sync('src/components/*/*.yaml').map((componentsConfig) => ({
  componentsPath: path.basename(componentsConfig, '.yaml'),
  componentsConfig: yaml.safeLoadAll(fs.readFileSync(componentsConfig))[0],
}));
const config = backstopConfig({ host, port, components });
const options = { config, docker };

const runBackstop = (command) => backstop(command, options);

gulp.task('backstop:approve', () => runBackstop('approve'));

gulp.task('backstop-test', async () => {
  console.log(chalk.green('\nStart server for visual regression testing'));

  const server = await new Promise((resolve) => {
    // eslint-disable-next-line no-shadow
    const server = app.listen(port, () => { resolve(server); });
  });

  console.log(chalk.green(`\nServer started at http://${host}:${port}`));

  try {
    console.log(chalk.green('\nPerforming visual regression testing'));
    await runBackstop('test');
  } finally {
    console.log(chalk.green('\nClose server for visual regression testing'));
    await server.close();
  }
});
