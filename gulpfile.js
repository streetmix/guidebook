var gulp = require('gulp');

var CNAME = 'guidebook.streetmix.net',
    BUILD_DIR = 'build',
    SOURCE_DIR = 'src';

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
    wintersmith   = require('run-wintersmith');

wintersmith.settings.configFile = 'config.json';

gulp.task('default', ['watch'], function () {
  console.log('Running!');
});

gulp.task('watch', function () {
  // Watch for changes to SCSS and recompile
  watch({glob: SOURCE_DIR + '/styles/**/*.scss'}, function() {
    return styles();
  });

  // Watch for changes to JavaScripts and recompile
  watch({glob: SOURCE_DIR + '/js/**/*.js'}, function() {
    return js();
  });

  // Watch for changes to content and rebuild
  watch({glob: SOURCE_DIR + '/contents/**/*.md'}, function() {
    return build();
  });
  watch({glob: SOURCE_DIR + '/templates/**/*.jade'}, function() {
    return build();
  });

  // Watch for changes to compiled CSS and reload browser
  gulp.src(BUILD_DIR + '/styles/styles.css')
    .pipe(watch())
    .pipe(plumber())
    .pipe(livereload());
});

gulp.task('build', function () {
  return build();
});

gulp.task('styles', function () {
  return styles();
});

gulp.task('js', function () {
  return js();
});

gulp.task('publish', function () {
  // TODO: Build before publishing?
  buildBranch({
    branch: 'gh-pages',
    folder: BUILD_DIR,
    domain: CNAME
  }, function(err) {
    if(err) {
      throw err;
    }
    console.log('Published!');
    // TODO: Auto-push to gh-pages remote?
  });
});

function build () {
  return wintersmith.build(function () {
    console.log('Wintersmith has finished building!');
  });
}

function js () {
  return gulp.src(SOURCE_DIR + '/js/**/*.js')
    .pipe(plumber())
    .pipe(order([
      'plugins.js',
      'vendor/*.js',
      '*.js'
      ]))
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(BUILD_DIR + '/js'));
}

function styles () {
  return gulp.src(SOURCE_DIR + '/styles/styles.scss')
    .pipe(plumber())
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cssimport())
    .pipe(minifyCSS({ keepSpecialComments: 0 }))
    .pipe(debug({ verbose: false }))
    .pipe(gulp.dest(BUILD_DIR + '/styles'));
}
