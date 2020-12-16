const gulp = require('gulp');
const del = require('del');
const taskArguments = require('./task-arguments');

// Clean task for a specified folder --------------------
// Removes all old files, except for package.json
// and README in all package
// ------------------------------------------------------

gulp.task('clean', () => {
  const { destination } = taskArguments;

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
