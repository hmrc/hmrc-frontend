const gulp = require('gulp');
const del = require('del');
const { argv } = require('yargs');

// Clean task for a specified folder --------------------
// Removes all old files, except for package.json
// and README in all package
// ------------------------------------------------------

gulp.task('clean', () => {
  const { destination } = argv;

  if (destination === 'package') {
    return del([
      `${destination}/**`,
      `!${destination}`,
    ]);
  }
  return del([
    `${destination}/**/*`,
  ]);
});
