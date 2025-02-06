const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const configPaths = require('../../config/paths.json');
const destinationPath = require('./destination-path');
const pkg = require('../../package.json');

function errorHandler(error) {
  console.error(error.message);

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1));
  this.emit('end');
}

gulp.task('scss:compile-all-govuk-and-hmrc', () => gulp.src(`${configPaths.src}all-govuk-and-hmrc.scss`)
  .pipe(plumber(errorHandler))
  .pipe(sourcemaps.init())
  .pipe(sass({
    loadPaths: ['node_modules', 'node_modules/govuk-frontend/dist', 'node_modules/govuk-frontend/dist/govuk/components'],
    quietDeps: true,
    silenceDeprecations: ['slash-div', 'mixed-decls', 'import', 'global-builtin'],
  }))
  // minify css add vendor prefixes and normalize to compiled css
  .pipe(postcss([
    autoprefixer,
    cssnano,
  ]))
  .pipe(rename({
    basename: `${configPaths.baseName}-${pkg.version}`,
    extname: '.min.css',
  }))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(destinationPath)));

gulp.task('scss:compile-accessible-autocomplete', () => gulp.src(`${configPaths.src}accessible-autocomplete.scss`)
  .pipe(plumber(errorHandler))
  .pipe(sourcemaps.init())
  .pipe(sass({
    loadPaths: ['node_modules', 'node_modules/govuk-frontend/dist', 'node_modules/govuk-frontend/dist/govuk/components'],
    quietDeps: true,
    silenceDeprecations: ['slash-div', 'mixed-decls', 'import', 'global-builtin'],
  }))
// minify css add vendor prefixes and normalize to compiled css
  .pipe(postcss([
    autoprefixer,
    cssnano,
  ]))
  .pipe(rename({
    basename: `accessible-autocomplete-${pkg.version}`,
  }))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(destinationPath)));
