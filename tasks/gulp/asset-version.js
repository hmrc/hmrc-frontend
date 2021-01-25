const fs = require('fs')
const gulp = require('gulp')
const del = require('del')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const vinylPaths = require('vinyl-paths')
const taskArguments = require('./task-arguments')
const pkg = require('../../package.json')

// Update assets' versions ----------
// Add all.package.json version
// ----------------------------------
gulp.task('update-assets-version', () => {
  fs.writeFileSync(`${taskArguments.destination}/VERSION.txt`, `${pkg.version}\r\n`)
  return gulp.src([
    `${taskArguments.destination}/**/*.min.*`
  ])
    .pipe(vinylPaths(del))
    .pipe(rename((obj) => {
      // eslint-disable-next-line no-param-reassign
      obj.basename = obj.basename.replace(/(hmrc.*)(?=\.min)/g, `$1-${pkg.version}`)
      return obj
    }))
    .pipe(replace(/(sourceMappingURL=maps\/hmrc.*)(?=\.min)/g, `$1-${pkg.version}`))
    .pipe(gulp.dest(`${taskArguments.destination}/`))
})
