const gulp = require('gulp');
const configPaths = require('../../config/paths.json');

gulp.task('copy-hmrc-images', () => gulp.src([
  'components/*/images/*',
], { cwd: `${configPaths.src}`, encoding: false })
  .pipe(gulp.dest(`${configPaths.dist}/components`)));

gulp.task('copy-govuk-crest-images', () => gulp.src([
  'assets/images/*',
], { cwd: `${configPaths.src}`, encoding: false })
  .pipe(gulp.dest(`${configPaths.dist}/assets/images`)));
