const gulp = require('gulp');
const destinationPath = require('./destination-path');

gulp.task('copy-govuk-fonts', () => gulp.src([
  'node_modules/govuk-frontend/dist/govuk/assets/fonts/*',
])
  .pipe(gulp.dest(`${destinationPath}/govuk/fonts`)));

gulp.task('copy-govuk-images', () => gulp.src([
  'node_modules/govuk-frontend/dist/govuk/assets/images/*',
])
  .pipe(gulp.dest(`${destinationPath}/govuk/images`)));

gulp.task('copy-govuk-manifest-json', () => gulp.src([
  'node_modules/govuk-frontend/dist/govuk/assets/manifest.json',
])
  .pipe(gulp.dest(`${destinationPath}/govuk`)));
