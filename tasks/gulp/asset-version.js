'use strict'

const fs = require('fs')
const gulp = require('gulp')
const del = require('del')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const vinylPaths = require('vinyl-paths')

// check for the flag passed by the task

const isDist = taskArguments.destination === 'dist' || false

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
gulp.task('update-assets-version', () => {
  let pkg = require('../../package.json')
  fs.writeFileSync(taskArguments.destination + '/VERSION.txt', pkg.version + '\r\n')
  return gulp.src([
    taskArguments.destination + '/**/*.min.*'
  ])
    .pipe(vinylPaths(del))
    .pipe(gulpif(isDist,
      rename(obj => {
        obj.basename = obj.basename.replace(/(hmrc.*)(?=\.min)/g, '$1-' + pkg.version)
        return obj
      })
    ))
    .pipe(replace(/(sourceMappingURL=maps\/hmrc.*)(?=\.min)/g, '$1-' + pkg.version))
    .pipe(gulp.dest(taskArguments.destination + '/'))
})
