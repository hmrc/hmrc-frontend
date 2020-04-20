'use strict'

const paths = require('./config/paths.json')
const gulp = require('gulp')
const runsequence = require('run-sequence')
const taskArguments = require('./tasks/gulp/task-arguments')
const nodemon = require('nodemon')

// Gulp sub-tasks
require('./tasks/gulp/clean.js')
require('./tasks/gulp/lint.js')
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/watch.js')
// new tasks
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/asset-version.js')
require('./tasks/gulp/sassdoc.js')

// Umbrella scripts tasks for preview ---
// Runs js lint and compilation
// --------------------------------------
gulp.task('scripts', cb => {
  runsequence('js:compile', cb)
})

// Umbrella styles tasks for preview ----
// Runs js lint and compilation
// --------------------------------------
gulp.task('styles', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

// Copy assets task ----------------------
// Copies assets to taskArguments.destination (public)
// --------------------------------------
gulp.task('copy:assets', () => {
  return gulp
    .src(paths.src + 'assets/**/*')
    .pipe(gulp.dest(taskArguments.destination + '/assets/'))
})

gulp.task('copy:README', () => {
  return gulp
    .src(paths.src + '../README.md')
    .pipe(gulp.dest(taskArguments.destination))
})

gulp.task('copy:packageJson', (done) => {
  const packageFile = require('./package.json')
  const requiredKeys = [
    'name',
    'version',
    'description',
    'main',
    'scss',
    'repository',
    'keywords',
    'author',
    'bugs',
    'homepage',
    'dependencies',
    'scripts'
  ]

  Object.keys(packageFile).forEach(key => {
    if (!requiredKeys.includes(key)) {
      delete packageFile[key]
    }
  })

  const requiredScripts = [
    'preinstall'
  ]

  Object.keys(packageFile.scripts).forEach(key => {
    if (!requiredScripts.includes(key)) {
      delete packageFile.scripts[key]
    }
  })

  require('fs').writeFileSync(
    taskArguments.destination + '/package.json',
    JSON.stringify(packageFile, null, 2)
  )

  done()
})

// All test combined --------------------
// Runs js, scss and accessibility tests
// --------------------------------------
gulp.task('test', cb => {
  runsequence('scss:lint', 'scss:compile', cb)
})

// Copy assets task for local & heroku --
// Copies files to
// taskArguments.destination (public)
// --------------------------------------
gulp.task('copy-assets', cb => {
  runsequence('styles', 'scripts', cb)
})

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task('dev', cb => {
  runsequence('clean', 'copy-assets', 'copy-dist-files', 'sassdoc', 'serve', cb)
})

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------

gulp.task('serve', ['watch'], () => {
  return nodemon({
    script: 'app/start.js'
  })
})

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task('build:package', cb => {
  runsequence(
    'clean',
    'copy-files',
    'copy-govuk-config',
    'copy-check-compatibility',
    'js:compile',
    'copy-assets',
    'copy:README',
    'copy:packageJson',
    cb
  )
})

gulp.task('build:dist', cb => {
  runsequence(
    'clean',
    'copy-assets',
    'copy-dist-files',
    'copy:assets',
    'update-assets-version',
    cb
  )
})
