const gulp = require('gulp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const backstop = require('backstopjs');
const util = require('node:util');
const configPaths = require('../../config/paths.json');
const backstopConfig = require('./backstop-config');
const app = require('../../app/app')({ nunjucks: { watch: false } });
const execFile = util.promisify(require('node:child_process').execFile);

const port = configPaths.ports.test;
const docker = !process.env.CI;
const defaultHost = docker ? 'host.docker.internal' : 'localhost';
const host = process.env.BACKSTOP_TEST_HOST || defaultHost;
const components = glob.sync('src/components/*/*.yaml').map((componentsConfig) => ({
  componentsPath: path.basename(componentsConfig, '.yaml'),
  componentsConfig: yaml.loadAll(fs.readFileSync(componentsConfig))[0],
}));
const config = backstopConfig({ host, port, components });
const options = { config, docker };

const runBackstop = (command) => backstop(command, options);

gulp.task('backstop:approve', () => runBackstop('approve'));

const green = '\x1b[32m';
const reset = '\x1b[0m';

gulp.task('backstop-test', async () => {
  console.log(`${green}\nStart server for visual regression testing${reset}`);

  const server = await new Promise((resolve) => {
    // eslint-disable-next-line no-shadow
    const server = app.listen(port, () => { resolve(server); });
  });

  console.log(`${green}\nServer started at http://${host}:${port}${reset}`);

  fs.rmSync('examples', {
    force: true,
    recursive: true,
  });

  await execFile('wget', [
    '--mirror', // because we want to crawl the site recursively
    '--page-requisites', // because we want things like css, javascript, fonts, and images
    '--adjust-extension', // because we want /preview links to become /preview.html links
    '--convert-links', // because we want the links to work in the static version
    '--directory-prefix', './examples', // because we want to output to ./examples
    '--no-host-directories', // because we want './examples/index.html' not './examples/localhost:3000/index.html'
    '--execute', 'robots=off', // because the existing robots.txt disallows wget so we only get index.html
    '--accept-regex', `localhost:${port}`, // because we don't want to try to visit any external links
    '--reject-regex', '\\?|\\.md$', // because we don't want to download links that have query strings
    '--timeout', '5', // seconds, because we don't want this to hang forever and eat up build minutes
    `http://localhost:${port}`,
  ], { stdio: 'inherit' }).catch(() => {
    console.log('ignoring errors during creating of static site');
  });

  console.log(`${green}\nClose server for visual regression testing${reset}`);

  await server.close();

  console.log(`${green}\nPerforming visual regression testing${reset}`);

  await runBackstop('test');
});
