'use strict'

const gulp = require('gulp')
const bs = require('browser-sync')
const cssnano = require('gulp-cssnano')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const rigger = require('gulp-rigger')
const htmlmin = require('gulp-htmlmin')
const htmlreplace = require('gulp-html-replace')
const postcss = require('gulp-postcss')
const stylelint = require('stylelint')
const config = require('stylelint-config-standard')
const reporter = require('postcss-browser-reporter')
const reporterESLint = require('gulp-reporter')
const clean = require('gulp-clean')
const gutil = require('gulp-util')
const notifier = require('node-notifier')
const eslint = require('gulp-eslint')

gulp.task('eslint', function () {
  gulp.src('project/src/js/*.js')
    .pipe(eslint({
      fix: true
    }))
    .pipe(eslint.result(result => {
      console.log(`ESLint result: ${result.filePath}`)
      console.log(`# Messages: ${result.messages.length}`)
      console.log(`# Warnings: ${result.warningCount}`)
      console.log(`# Errors: ${result.errorCount}`)
    }))
    .pipe(reporterESLint({
      browser: true,
      selector: 'body:before',
      styles: {
        'background-color': 'crimson',
        'background': 'crimson',
        'max-height': '70vh',
        'overflow-y': 'scroll',
        'font-size': '1.4rem',
        'display': 'none'
      }
    }))
    .pipe(gulp.dest('project/src/js_lint'))
})

gulp.task('clean', function () {
  gulp.src('project/src/css_lint')
    .pipe(clean())
})

gulp.task('clean:build', function () {
  const src = 'project/build/assets,project/build/css,project/build/data,project/build/js,project/build/browserconfig.xml,project/build/index.html,project/build/manifest.json,project/build/sw.js,project/build/.travis.yml'
  gulp.src(src).pipe(clean())
})

gulp.task('lint', ['clean'], function () {
  var processors = [
    stylelint({
      failAfterError: false,
      config
    }),
    reporter({
      selector: 'html::before',
      styles: {
        'background-color': 'crimson',
        'background': 'crimson',
        'max-height': '70vh',
        'overflow-y': 'scroll',
        'font-size': '1rem',
        'line-height': '1'
      }
    })
  ]

  gulp.src('project/src/css/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('project/src/css_lint'))
    .pipe(bs.reload({ stream: true }))
})

gulp.task('moveAssets', function () {
  let filesToMove = [
    'project/src/sw.js',
    'project/src/manifest.json',
    'project/src/browserconfig.xml',
    'project/src/.travis.yml'
  ]

  console.dir('test')

  gulp.src('project/src/assets/**/*')
    .pipe(gulp.dest('project/build/assets'))

  gulp.src('project/src/data/**/*')
    .pipe(gulp.dest('project/build/data'))

  gulp.src(filesToMove)
    .pipe(gulp.dest('project/build'))
})

gulp.task('html', function () {
  gulp.src('project/src/index.html')
    .pipe(rigger())
    .pipe(htmlreplace({
      'css': 'css/build.style.css',
      'js': 'js/build.js',
      'pre': '<link href="css/build.style.css" rel="preload" as="style"><link href="js/build.js" rel="preload" as="script">'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('project/build'))
    .pipe(bs.reload({ stream: true }))
})

gulp.task('css', function () {
  gulp.src([
    'project/src/css/normalize.css',
    'project/src/css/layout.css',
    'project/src/css/typograph.css',
    'project/src/css/style.css',
    'project/src/css/mobile.css',
    'project/src/css/posts.css'
  ])
    .pipe(concat('build.style.css'))
    .pipe(autoprefixer({ browsers: ['> 0% in RU'] }))
    .pipe(cssnano())
    .pipe(gulp.dest('project/build/css'))
    .pipe(bs.reload({ stream: true }))
})

gulp.task('browser-sync', function () {
  bs({
    server: {
      baseDir: 'project/src'
    },
    notify: false
  })
})

gulp.task('watch', ['browser-sync', 'html', 'lint', 'css', 'eslint'], function () {
  gulp.watch('project/src/css/*.css', ['lint'], function () {})
  gulp.watch('project/src/*.html', bs.reload({ stream: true }))
  gulp.watch('project/src/js/**/*.js', ['clean', 'eslint'], bs.reload({ stream: true }))
})

gulp.task('default', ['watch'], function () {})

gulp.task('build', ['clean:build', 'html', 'css', 'moveAssets'], function (done) {
  console.clear()

  console.log('*******************')
  console.log('gulp build complete')
  console.log('*******************')

  const webpack = require('webpack')
  const webpackConfig = require('./webpack.config.js')

  let statsLog = {
    colors: true,
    reasons: true
  }

  webpack(webpackConfig, onComplete)

  function onComplete (error, stats) {
    if (error) {
      onError(error)
    } else if (stats.hasErrors()) {
      onError(stats.toString(statsLog))
    } else {
      onSuccess(stats.toString(statsLog))
    }
  }

  function onError (error) {
    let formatedError = new gutil.PluginError('webpack', error)
    notifier.notify({
      title: `Error: ${formatedError.plugin}`,
      message: formatedError.message
    })
    done(formatedError)
  }

  function onSuccess (detailInfo) {
    gutil.log('[webpack]', detailInfo)
    done()
  }
})
