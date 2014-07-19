var gulp = require('gulp');

var autoprefix    = require('gulp-autoprefixer'),
    cssimport     = require('gulp-cssimport'),
    debug         = require('gulp-debug'),
    livereload    = require('gulp-livereload'),
    minifyCSS     = require('gulp-minify-css'),
    sass          = require('gulp-sass');

gulp.task('css', function () {
  gulp.src('./stylesheets/styles.scss')
    .pipe(sass())
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssimport())
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ verbose: false }))
    .pipe(gulp.dest('./stylesheets'));
});
