const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const merge = require('merge-stream');
const rollup = require('gulp-better-rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify-es').default;
const eol = require('gulp-eol');
const oldie = require('oldie');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const postcsspseudoclasses = require('postcss-pseudo-classes');
const sourcemaps = require('gulp-sourcemaps');
const taskArguments = require('./task-arguments');
const configPaths = require('../../config/paths.json');

// Compile CSS and JS task --------------
// --------------------------------------

// check if destination flag is dist
const isDist = taskArguments.destination === 'dist' || false;
const isPackage = taskArguments.destination === 'package' || false;

// Set the destination
const destinationPath = () => {
  // Public & Dist directories do not need to be namespaced with `hmrc`
  if (taskArguments.destination === 'dist' || taskArguments.destination === 'public') {
    return taskArguments.destination;
  }
  return `${taskArguments.destination}/hmrc/`;
};

const errorHandler = (error) => {
  // Log the error to the console
  console.error(error.message);

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1));
  this.emit('end');
};
// different entry points for both streams below and depending on destination flag
const compileStylesheet = isDist ? `${configPaths.src}all.scss` : `${configPaths.app}assets/scss/app.scss`;
const compileOldIeStylesheet = isDist ? `${configPaths.src}all-ie8.scss` : `${configPaths.app}assets/scss/app-ie8.scss`;

gulp.task('scss:compile', () => {
  const compile = gulp.src(compileStylesheet)
    .pipe(plumber(errorHandler))
    .pipe(gulpif(!isPackage, sourcemaps.init()))
    .pipe(sass({
      includePaths: ['node_modules'],
    }))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([
      autoprefixer,
      cssnano,
    ])))
    .pipe(gulpif(!isDist, postcss([
      autoprefixer,
      // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
      // :hover class you can use to simulate the hover state in the review app
      postcsspseudoclasses,
    ])))
    .pipe(gulpif(isDist,
      rename({
        basename: 'hmrc-frontend',
        extname: '.min.css',
      })))
    // Write external sourcemap files to a maps directory of the destination,
    // but not for the npm package
    .pipe(gulpif(!isPackage, sourcemaps.write('./maps')))
    .pipe(gulp.dest(`${taskArguments.destination}/`));

  const compileOldIe = gulp.src(compileOldIeStylesheet)
    .pipe(plumber(errorHandler))
    .pipe(gulpif(!isPackage, sourcemaps.init()))
    .pipe(sass({
      includePaths: ['node_modules'],
    }))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([
      autoprefixer,
      cssnano,
      // transpile css for ie https://github.com/jonathantneal/oldie
      oldie({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true },
        // more rules go here
      }),
    ])))
    .pipe(gulpif(!isDist, postcss([
      autoprefixer,
      oldie({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true },
        // more rules go here
      }),
    ])))
    .pipe(gulpif(isDist,
      rename({
        basename: 'hmrc-frontend-ie8',
        extname: '.min.css',
      })))
    // Write external sourcemap files to a maps directory of the destination,
    // but not for the npm package
    .pipe(gulpif(!isPackage, sourcemaps.write('./maps')))
    .pipe(gulp.dest(`${taskArguments.destination}/`));

  return merge(compile, compileOldIe);
});

// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
  // for dist/ folder we only want compiled 'all.js' file
  const srcFiles = isDist ? `${configPaths.src}all.js` : `${configPaths.src}**/*.js`;
  return gulp.src([
    srcFiles,
    `!${configPaths.src}**/*.test.js`,
  ])
    .pipe(gulpif(!isPackage, sourcemaps.init()))
    .pipe(rollup({
      plugins: [
        resolve(),
        commonjs(),
      ],
    }, {
      // Used to set the `window` global and UMD/AMD export name.
      name: 'HMRCFrontend',
      // Legacy mode is required for IE8 support
      legacy: true,
      // UMD allows the published bundle to work in CommonJS and in the browser.
      format: 'umd',
    }))
    .pipe(gulpif(isDist, uglify().on('error', (e) => {
      console.error('An error occurred while uglifying');
      console.error(e);
    })))
    .pipe(gulpif(isDist,
      rename({
        basename: 'hmrc-frontend',
        extname: '.min.js',
      })))
    .pipe(eol())
    // Write external sourcemap files to a maps directory of the destination,
    // but not for the npm package
    .pipe(gulpif(!isPackage, sourcemaps.write('./maps')))
    .pipe(gulp.dest(destinationPath));
});

gulp.task('js:copy', () => {
  // for dist/ folder we only want compiled 'all.js' file
  const srcFiles = isDist ? `${configPaths.src}all.js` : `${configPaths.src}**/*.js`;
  return gulp.src([
    srcFiles,
    `!${configPaths.src}**/*.test.js`,
  ])
    .pipe(gulpif(!isPackage, sourcemaps.init()))
    .pipe(gulp.dest('copy-test'));
});
