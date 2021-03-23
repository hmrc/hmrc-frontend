const gulp = require('gulp');
const configPaths = require('../../config/paths.json');

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------
gulp.task('watch', () => Promise.all([
  gulp.watch([`${configPaths.src}**/*.scss`, `${configPaths.app}assets/scss/**/*.scss`], gulp.series('scss:compile-all-govuk-and-hmrc')),
  gulp.watch([`${configPaths.src}**/*.js`], gulp.series('js:compile-all-govuk-and-hmrc')),
]));
