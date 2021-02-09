const gulp = require('gulp');
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

gulp.task('copy-dist-files', gulp.series(
  'copy-hmrc-images',
  'copy-govuk-images',
  'copy-govuk-fonts',
  'copy-html5shiv',
));

gulp.task('copy-package-files', gulp.series(
  'copy-package-sources',
  'copy-govuk-fonts',
  'copy-govuk-images',
  'copy-html5shiv',
  'copy-govuk-config',
  'copy-check-compatibility',
));

gulp.task('build:package', gulp.series(
  'clean',
  'copy-package-files',
  'scss:compile-all-govuk-and-hmrc',
  'js:compile-hmrc',
  'js:compile-all-govuk-and-hmrc',
  'update-assets-version',
  'copy:README',
  'copy:packageJson',
));

gulp.task('build:dist', gulp.series(
  'clean',
  'copy-dist-files',
  'scss:compile-all-govuk-and-hmrc',
  'js:compile-all-govuk-and-hmrc',
  'update-assets-version',
));

gulp.task('backstop:test', gulp.series('build:dist', 'backstop-test'));

gulp.task('nodemon', () => nodemon({
  script: 'app/start.js',
}));

gulp.task('dev', gulp.series('build:dist', gulp.parallel('nodemon', 'watch')));
