'use strict'

const gulp = require('gulp')
const taskArguments = require('./task-arguments')
const del = require('del')

// Clean task for a specified folder --------------------
// Removes all old files, except for package.json
// and README in all package
// ------------------------------------------------------

gulp.task('clean', () => {
  const destination = taskArguments.destination

  if (destination === 'package') {
    return del.sync([
      `${destination}/**`,
      `!${destination}`
    ])
  } else {
    return del.sync([
      `${destination}/**/*`
    ])
  }
})
