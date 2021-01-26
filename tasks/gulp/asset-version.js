const fs = require('fs');
const gulp = require('gulp');
const pkg = require('../../package.json');
const destinationPath = require('./destination-path');

gulp.task('update-assets-version', (cb) => {
  fs.writeFileSync(`${destinationPath}/VERSION.txt`, `${pkg.version}\r\n`);
  cb();
});
