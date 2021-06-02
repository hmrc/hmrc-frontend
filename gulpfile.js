const { series, parallel } = require('gulp');
const nodemon = require('nodemon');

require('./tasks/gulp/clean.js');
require('./tasks/gulp/compile-js.js');
require('./tasks/gulp/compile-scss.js');
require('./tasks/gulp/watch.js');
require('./tasks/gulp/copy-to-destination.js');
require('./tasks/gulp/asset-version.js');
require('./tasks/gulp/backstop.js');
require('./tasks/gulp/package.js');
require('./tasks/gulp/dist.js');

const { publishLocalWebjar, buildWebjar } = require('./tasks/gulp/webjar');

const copyDistFiles = series(
  'copy-hmrc-images',
  'copy-govuk-images',
  'copy-govuk-fonts',
  'copy-html5shiv',
);

const copyPackageFiles = series(
  'copy-package-sources',
  'copy-govuk-fonts',
  'copy-govuk-images',
  'copy-html5shiv',
  'copy-govuk-config',
  'copy-check-compatibility',
);

const buildPackage = series(
  'clean',
  copyPackageFiles,
  'scss:compile-all-govuk-and-hmrc',
  'js:compile-hmrc',
  'js:compile-all-govuk-and-hmrc',
  'update-assets-version',
  'copy:README',
  'copy:LICENSE',
  'copy:packageJson',
);

const buildDist = series(
  'clean',
  copyDistFiles,
  'scss:compile-all-govuk-and-hmrc',
  'js:compile-all-govuk-and-hmrc',
  'update-assets-version',
);

const backstopTest = series(buildDist, 'backstop-test');

const startNodemon = () => nodemon({
  script: 'app/start.js',
});

const dev = series(buildDist, parallel(startNodemon, 'watch'));

// FIXME: fix named tasks above to export rather than using gulp.task, to avoid globally registering
// tasks unnecessarily
// See: https://gulpjs.com/docs/en/getting-started/creating-tasks
module.exports = {
  buildPackage,
  buildDist,
  backstopTest,
  dev,
  buildWebjar,
  publishLocalWebjar,
};
