const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const merge = require('merge-stream');
const oldie = require('oldie');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const configPaths = require('../../config/paths.json');
const destinationPath = require('./destination-path');
const pkg = require('../../package.json');

const errorHandler = (error) => {
  console.error(error.message);

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1));
  this.emit('end');
};

gulp.task('scss:compile-all-govuk-and-hmrc', () => {
  const compile = gulp.src(`${configPaths.src}all-govuk-and-hmrc.scss`)
    .pipe(plumber(errorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules'],
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
    .pipe(gulp.dest(destinationPath));

  const compileOldIe = gulp.src(`${configPaths.src}all-govuk-and-hmrc-ie8.scss`)
    .pipe(plumber(errorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules'],
    }))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(postcss([
      autoprefixer,
      cssnano,
      // transpile css for ie https://github.com/jonathantneal/oldie
      oldie({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true },
      }),
    ]))
    .pipe(rename({
      basename: `${configPaths.baseName}-ie8-${pkg.version}`,
      extname: '.min.css',
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(destinationPath));

  return merge(compile, compileOldIe);
});
