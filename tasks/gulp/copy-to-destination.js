const gulp = require('gulp');
const destinationPath = require('./destination-path');

gulp.task('copy-govuk-fonts', () => gulp.src([
  'node_modules/govuk-frontend/govuk/assets/fonts/*',
])
  .pipe(gulp.dest(`${destinationPath}/govuk/fonts`)));

gulp.task('copy-govuk-images', () => gulp.src([
  'node_modules/govuk-frontend/govuk/assets/images/*',
])
  .pipe(gulp.dest(`${destinationPath}/govuk/images`)));

gulp.task('copy-html5shiv', () => gulp.src([
  'node_modules/html5shiv/dist/html5shiv.min.js',
])
  .pipe(gulp.dest(`${destinationPath}/vendor`)));
