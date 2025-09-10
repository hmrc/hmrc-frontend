const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('gulp-uglify-es').default;
const eol = require('gulp-eol');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('@rollup/plugin-babel');
const configPaths = require('../../config/paths.json');
const destinationPath = require('./destination-path');
const pkg = require('../../package.json');

gulp.task('js:compile-hmrc', () => gulp.src([`${configPaths.src}all.js`])
  .pipe(rollup({
    plugins: [
      babel(),
      resolve(),
      commonjs(),
    ],
  }, {
    name: 'HMRCFrontend',
    // UMD allows the published bundle to work in CommonJS and in the browser.
    format: 'umd',
  }))
  .pipe(eol())
  .pipe(gulp.dest(destinationPath)));

gulp.task('js:compile-all-govuk-and-hmrc', () => gulp.src([
  `${configPaths.src}all-govuk-and-hmrc.js`,
])
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
      babel(),
      resolve(),
      commonjs(),
    ],
  }, {
    // Using an immediately invoked function expression (IIFE) as the all-govuk-and-hmrc.js can
    // only be run in a browser
    format: 'iife',
  }))
  .pipe(uglify())
  .pipe(
    rename({
      basename: `${configPaths.baseName}-${pkg.version}`,
      extname: '.min.js',
    }),
  )
  .pipe(eol())
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest(destinationPath)));

gulp.task('js:compile-accessible-autocomplete', () => gulp.src([`${configPaths.src}accessible-autocomplete.js`])
  .pipe(rollup({
    plugins: [
      babel(),
      resolve(),
      commonjs(),
    ],
  }, {
    name: 'HMRCAccessibleAutocomplete',
    // UMD allows the published bundle to work in CommonJS and in the browser.
    format: 'umd',
  }))
  .pipe(
    rename({
      basename: `accessible-autocomplete-${pkg.version}`,
    }),
  )
  .pipe(eol())
  .pipe(gulp.dest(destinationPath)));
