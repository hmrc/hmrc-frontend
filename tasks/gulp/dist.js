const gulp = require('gulp');
const configPaths = require('../../config/paths.json');

gulp.task('copy-hmrc-images', () => gulp.src([
  'components/*/images/*',
], { cwd: `${configPaths.src}/` })
  .pipe(gulp.dest(configPaths.dist)));
