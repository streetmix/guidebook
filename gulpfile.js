var gulp = require('gulp')

var autoprefix = require('gulp-autoprefixer')
var buildbranch = require('buildbranch')
var concat = require('gulp-concat')
var cssimport = require('gulp-cssimport')
var debug = require('gulp-debug')
var livereload = require('gulp-livereload')
var minifyCSS = require('gulp-minify-css')
var order = require('gulp-order')
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var watch = require('gulp-watch')
var wintersmith = require('wintersmith')

var CNAME = 'guidebook.streetmix.net'
var BUILD_DIR = 'build'
var SOURCE_DIR = 'src'

gulp.task('default', ['build', 'js', 'styles'], function () {
  gulp.start('watch')
  console.log('Running!')
})

gulp.task('watch', function () {
  livereload.listen()

  // Watch for changes to SCSS and recompile
  watch(SOURCE_DIR + '/styles/**/*.scss', function () {
    gulp.start('styles')
  })

  // Watch for changes to JavaScripts and recompile
  watch(SOURCE_DIR + '/js/**/*.js', function () {
    gulp.start('js')
  })

  // Watch for changes to content and rebuild
  watch([SOURCE_DIR + '/contents/**/*.md', SOURCE_DIR + '/templates/**/*.jade'], function () {
    gulp.start('build')
  })

  // Watch for changes to compiled CSS and reload browser
  watch(BUILD_DIR + '/styles/styles.css')
    .pipe(plumber())
    .pipe(livereload())
})

gulp.task('build', function (callback) {
  var env = wintersmith('config.json')
  env.build(function (error) {
    if (error) throw error
    console.log('Wintersmith has finished building!')
  })
  if (typeof callback === 'function') callback()
})

gulp.task('styles', function () {
  return gulp.src(SOURCE_DIR + '/styles/styles.scss')
    .pipe(plumber())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssimport())
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ minimal: false }))
    .pipe(gulp.dest(BUILD_DIR + '/styles'))
})

gulp.task('js', function () {
  return gulp.src(SOURCE_DIR + '/js/**/*.js')
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

gulp.task('publish', ['build', 'styles', 'js'], function () {
  buildbranch({
    branch: 'gh-pages',
    ignore: ['.DS_Store'],
    folder: BUILD_DIR,
    domain: CNAME
  }, function (err) {
    if (err) {
      throw err
    }
    console.log('Published!')
  })
})
