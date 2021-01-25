const gulp = require('gulp')
const nodemon = require('nodemon')
const fs = require('fs')
const paths = require('./config/paths.json')
const taskArguments = require('./tasks/gulp/task-arguments')
const packageFile = require('./package.json')

// Gulp sub-tasks
require('./tasks/gulp/clean.js')
require('./tasks/gulp/compile-assets.js')
require('./tasks/gulp/watch.js')
// new tasks
require('./tasks/gulp/copy-to-destination.js')
require('./tasks/gulp/asset-version.js')
require('./tasks/gulp/backstop.js')

// Copy assets task ----------------------
// Copies assets to taskArguments.destination (public)
// --------------------------------------
gulp.task('copy:assets', () => gulp
  .src(`${paths.src}assets/**/*`)
  .pipe(gulp.dest(`${taskArguments.destination}/assets/`)))

gulp.task('copy:README', () => gulp
  .src(`${paths.src}../README.md`)
  .pipe(gulp.dest(taskArguments.destination)))

gulp.task('copy:packageJson', (done) => {
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

  Object.keys(packageFile).forEach((key) => {
    if (!requiredKeys.includes(key)) {
      delete packageFile[key]
    }
  })

  const requiredScripts = [
    'preinstall'
  ]

  Object.keys(packageFile.scripts).forEach((key) => {
    if (!requiredScripts.includes(key)) {
      delete packageFile.scripts[key]
    }
  })

  fs.writeFileSync(
    `${taskArguments.destination}/package.json`,
    JSON.stringify(packageFile, null, 2)
  )

  done()
})

// Compile scss and js assets
// --------------------------------------
gulp.task('compile-assets', gulp.series('scss:compile', 'js:compile'))

// Compile and copy assets
// --------------------------------------
gulp.task('compile-and-copy-assets', gulp.series('compile-assets', 'copy-dist-files'))

gulp.task('nodemon', () => nodemon({
  script: 'app/start.js'
}))

// Serve task ---------------------------
// Restarts node app when there is changed
// affecting js, css or njk files
// --------------------------------------
gulp.task('serve', gulp.parallel('nodemon', 'watch'))

// Dev task -----------------------------
// Runs a sequence of task on start
// --------------------------------------
gulp.task('dev', gulp.series('clean', 'compile-and-copy-assets', 'serve'))

// Build package task -----------------
// Prepare package folder for publishing
// -------------------------------------
gulp.task('build:package', gulp.series(
  'clean',
  'copy-files',
  'copy-govuk-config',
  'copy-check-compatibility',
  'js:compile',
  'scss:compile',
  'update-assets-version',
  'copy:README',
  'copy:packageJson'
))

gulp.task('build:dist', gulp.series(
  'clean',
  'compile-and-copy-assets',
  'copy:assets',
  'update-assets-version'
))

gulp.task('backstop:test', gulp.series('compile-and-copy-assets', 'backstop-test'))
