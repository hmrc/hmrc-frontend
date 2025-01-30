const gulp = require('gulp');

const fs = require('fs');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcss1 = require('postcss-scss');
const filter = require('gulp-filter');
const packageFile = require('../../package.json');
const configPaths = require('../../config/paths.json');

const scssFiles = filter([`${configPaths.src}**/*.scss`], { restore: true });

gulp.task('copy:README', () => gulp
  .src(`${configPaths.src}../README.md`)
  .pipe(gulp.dest(configPaths.package)));

gulp.task('copy:LICENSE', () => gulp
  .src(`${configPaths.src}../LICENSE`)
  .pipe(gulp.dest(configPaths.package)));

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
    'scripts',
    'license',
  ];

  Object.keys(packageFile).forEach((key) => {
    if (!requiredKeys.includes(key)) {
      delete packageFile[key];
    }
  });

  const requiredScripts = [
    'preinstall',
  ];

  Object.keys(packageFile.scripts).forEach((key) => {
    if (!requiredScripts.includes(key)) {
      delete packageFile.scripts[key];
    }
  });

  fs.writeFileSync(
    `${configPaths.package}package.json`,
    JSON.stringify(packageFile, null, 2),
  );

  done();
});

gulp.task('copy-govuk-config', () => gulp.src([`${configPaths.src}govuk-prototype-kit.config.json`])
  .pipe(gulp.dest(configPaths.package)));

gulp.task('copy-package-sources', () => gulp.src([
  `${configPaths.src}**/*`,
  '!**/.DS_Store',
  '!**/*.test.js',
  `!${configPaths.src}govuk-prototype-kit.config.json`,
  `!${configPaths.components}**/README.njk`,
  `!${configPaths.components}**/*.{yml,yaml}`,
  `!${configPaths.components}**/example.njk`,
  `!${configPaths.components}**/__snapshots__/**`,
  `!${configPaths.components}**/__snapshots__/`,
  `!${configPaths.components}**/sca-account-menu/**`,
], { encoding: false })
  .pipe(scssFiles)
  .pipe(postcss([
    autoprefixer,
  ], { syntax: postcss1 }))
  .pipe(scssFiles.restore)
  .pipe(gulp.dest(`${configPaths.package}hmrc/`)));
