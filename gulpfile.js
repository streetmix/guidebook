var gulp = require('gulp');

var autoprefix    = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    cssimport     = require('gulp-cssimport'),
    debug         = require('gulp-debug'),
    livereload    = require('gulp-livereload'),
    minifyCSS     = require('gulp-minify-css'),
    plumber       = require('gulp-plumber'),
    order         = require('gulp-order'),
    sass          = require('gulp-sass'),
    uglify        = require('gulp-uglify'),
    watch         = require('gulp-watch');

gulp.task('default', ['watch'], function () {
  console.log('Running!');
});

gulp.task('watch', function () {
  // Watch for changes to SCSS and recompile
  watch({glob: './app/styles/**/*.scss'}, function() {
    return styles();
  })

  // Watch for changes to JavaScripts and recompile
  watch({glob: './app/js/**/*.js'}, function() {
    return js();
  })

  // Watch for changes to compiled CSS and reload browser
  gulp.src('./dist/styles/styles.css')
    .pipe(watch())
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('styles', function () {
  return styles();
});

gulp.task('js', function () {
  return js();
});

function js () {
  return gulp.src('./app/js/**/*.js')
    .pipe(plumber())
    .pipe(order([
      'plugins.js',
      'vendor/*.js',
      '*.js'
      ]))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js'));
}

function styles () {
  return gulp.src('./app/styles/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssimport())
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ verbose: false }))
    .pipe(gulp.dest('./dist/styles'));
}
