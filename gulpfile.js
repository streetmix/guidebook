var gulp = require('gulp')

var CNAME       = 'guidebook.streetmix.net',
    BUILD_DIR   = 'build',
    SOURCE_DIR  = 'src'

var autoprefix    = require('gulp-autoprefixer'),
    buildBranch   = require('buildbranch'),
    concat        = require('gulp-concat'),
    cssimport     = require('gulp-cssimport'),
    debug         = require('gulp-debug'),
    del           = require('del'),
    livereload    = require('gulp-livereload'),
    minifyCSS     = require('gulp-minify-css'),
    plumber       = require('gulp-plumber'),
    order         = require('gulp-order'),
    sass          = require('gulp-sass'),
    uglify        = require('gulp-uglify'),
    watch         = require('gulp-watch'),
    wintersmith   = require('run-wintersmith')

wintersmith.settings.configFile = 'config.json'

gulp.task('default', ['watch'], function () {
  console.log('Running!')
})

gulp.task('watch', function () {
  // Watch for changes to SCSS and recompile
  watch(SOURCE_DIR + '/styles/**/*.scss', function (files, cb) {
    gulp.start('styles', cb)
  })

  // Watch for changes to JavaScripts and recompile
  watch(SOURCE_DIR + '/js/**/*.js', function (files, cb) {
    gulp.start('js', cb)
  })

  // Watch for changes to content and rebuild
  watch([SOURCE_DIR + '/contents/**/*.md', SOURCE_DIR + '/templates/**/*.jade'], function (files, cb) {
    gulp.start('build', cb)
  })

  // Watch for changes to compiled CSS and reload browser
  /*
  watch(BUILD_DIR + '/styles/styles.css')
    .pipe(watch())
    .pipe(plumber())
    .pipe(livereload())
    */
})

gulp.task('build', function () {
  wintersmith.build(function () {
    console.log('Wintersmith has finished building!')
  })
})

gulp.task('styles', function () {
  gulp.src(SOURCE_DIR + '/styles/styles.scss')
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssimport())
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ verbose: false }))
    .pipe(gulp.dest(BUILD_DIR + '/styles'))
})

gulp.task('js', function () {
  gulp.src(SOURCE_DIR + '/js/**/*.js')
    .pipe(plumber())
    .pipe(order([
      'plugins.js',
      'vendor/*.js',
      '*.js'
      ]))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(BUILD_DIR + '/js'))
})

gulp.task('publish', function () {
  // TODO: Build before publishing?
  buildBranch({
    branch: 'gh-pages',
    folder: BUILD_DIR,
    domain: CNAME
  }, function (err) {
    if (err) {
      throw err
    }
    console.log('Published!')
  })
})
