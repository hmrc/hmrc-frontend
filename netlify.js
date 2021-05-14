/* eslint-env node */

const { spawn, execSync } = require('child_process');

// Create a static version of the site which can be hosted in a netlify deploy preview

// 1. build static assets
execSync('gulp build:dist', { stdio: 'inherit' });

const port = process.env.PORT || 3000;

// 2. start server
const server = require('./app/app.js')().listen(port, () => {
  process.stdout.write(`Server started at http://localhost:${port}\n`);
});

// 3. build a static mirror of site by crawling server
const wget = spawn('wget', [
  '--mirror', // because we want to crawl the site recursively
  '--page-requisites', // because we want things like css, javascript, fonts, and images
  '--adjust-extension', // because we want /preview links to become /preview.html links
  '--convert-links', // because we want the links to work in the static version
  '--directory-prefix', './netlify', // because we want to output to ./netlify
  '--no-host-directories', // because we want './netlify/index.html' not './netlify/localhost:3000/index.html'
  '--execute', 'robots=off', // because the existing robots.txt disallows wget so we only get index.html
  '--accept-regex', `localhost:${port}`, // because we don't want to try to visit any external links
  '--reject-regex', '\\?', // because we don't want to download links that have query strings
  '--timeout', '5', // seconds, because we don't want this to hang forever and eat up build minutes
  `http://localhost:${port}`,
], { stdio: 'inherit' });

// 4. stop server
wget.on('exit', () => {
  process.stdout.write(`Finished crawling site, stopping server http://localhost:${port}...\n`);

  server.close(() => {
    process.stdout.write('Server closed gracefully\n');
    process.exit(0);
  });

  setTimeout(() => {
    process.stdout.write('Server failed to close gracefully, exiting\n');
    process.exit(0);
  }, 6000).unref();
});
