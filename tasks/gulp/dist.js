const gulp = require('gulp');
const configPaths = require('../../config/paths.json');

gulp.task('copy-hmrc-images', () => gulp.src([
  'components/*/images/*',
], { cwd: `${configPaths.src}`, encoding: false })
  .pipe(gulp.dest('dist/components')));
