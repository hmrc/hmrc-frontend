const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const filter = require('gulp-filter');
const postcss1 = require('postcss-scss');
const taskArguments = require('./task-arguments');
const configPaths = require('../../config/paths.json');

const scssFiles = filter([`${configPaths.src}**/*.scss`], { restore: true });

gulp.task('copy-files', () => gulp.src([
  `${configPaths.src}**/*`,
  '!**/.DS_Store',
  '!**/*.test.js',
  `!${configPaths.src}govuk-prototype-kit.config.json`,
  `!${configPaths.components}**/README.njk`,
  `!${configPaths.components}**/*.{yml,yaml}`,
  `!${configPaths.components}**/example.njk`,
  `!${configPaths.components}**/__snapshots__/**`,
  `!${configPaths.components}**/__snapshots__/`,
])
  .pipe(scssFiles)
  .pipe(postcss([
    autoprefixer,
  ], { syntax: postcss1 }))
  .pipe(scssFiles.restore)
  .pipe(gulp.dest(`${taskArguments.destination}/hmrc/`)));

gulp.task('copy-govuk-config', () => gulp.src([`${configPaths.src}govuk-prototype-kit.config.json`])
  .pipe(gulp.dest(`${taskArguments.destination}/`)));

gulp.task('copy-check-compatibility', () => gulp.src(['check-compatibility.js'])
  .pipe(gulp.dest(`${taskArguments.destination}/`)));

gulp.task('copy-dist-component-files', () => gulp.src([
  'components/*/images/*',
], { cwd: `${configPaths.src}/**` })
  .pipe(gulp.dest(`${taskArguments.destination}/`)));

gulp.task('copy-dist-fonts', () => gulp.src([
  'node_modules/govuk-frontend/govuk/assets/fonts/*',
])
  .pipe(gulp.dest(`${taskArguments.destination}/fonts`)));

gulp.task('copy-dist-files', gulp.series('copy-dist-component-files', 'copy-dist-fonts'));
