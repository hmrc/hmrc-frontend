const gulp = require('gulp');
const destinationPath = require('./destination-path');

gulp.task('copy-govuk-images-rebrand', () => gulp.src([
  'node_modules/govuk-frontend/dist/govuk/assets/rebrand/images/*',
], { encoding: false })
  .pipe(gulp.dest(`${destinationPath}/govuk/rebrand/images`)));

gulp.task('copy-govuk-manifest-json-rebrand', () => gulp.src([
  'node_modules/govuk-frontend/dist/govuk/assets/rebrand/manifest.json',
])
  .pipe(gulp.dest(`${destinationPath}/govuk/rebrand`)));
