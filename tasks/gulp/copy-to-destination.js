'use strict'

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const taskArguments = require('./task-arguments')
const filter = require('gulp-filter')

let scssFiles = filter([configPaths.src + '**/*.scss'], {restore: true})

gulp.task('copy-files', () => {
  return gulp.src([
    configPaths.src + '**/*',
    '!**/.DS_Store',
    '!**/*.test.js',
    '!' + configPaths.src + 'README.md', // Don't override the existing README in /package
    '!' + configPaths.components + '**/README.njk',
    '!' + configPaths.components + '**/*.{yml,yaml}',
    '!' + configPaths.components + '**/example.njk',
    '!' + configPaths.components + '**/__snapshots__/**',
    '!' + configPaths.components + '**/__snapshots__/'
  ])
    .pipe(scssFiles)
    .pipe(postcss([
      autoprefixer
    ], {syntax: require('postcss-scss')}))
    .pipe(scssFiles.restore)
    .pipe(gulp.dest(taskArguments.destination + '/'))
})

gulp.task('copy-dist-files', ['copy-dist-component-files', 'copy-dist-fonts'])

gulp.task('copy-dist-component-files', () => {
  return gulp.src([
    configPaths.src + '{components,needs-to-be-a-glob-to-preserve-directories}/hmrc-account-menu/images/*'
  ])
    .pipe(gulp.dest(taskArguments.destination + '/'))
})

gulp.task('copy-dist-fonts', () => {
  return gulp.src([
    'node_modules/govuk-frontend/assets/fonts/*'
  ])
    .pipe(gulp.dest(taskArguments.destination + '/fonts'))
})
