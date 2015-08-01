var gulp  = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false });
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');

gulp.task('default', $.sequence('js', 'less', 'server'));

// Assets

var customOpts = {
  entries: ['./assets/scripts/main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

var bundle = function() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe($.sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe($.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./public/assets'));
}

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

gulp.task('less', function() {
  return gulp.src('./assets/styles/main.less')
    .pipe($.less())
    .pipe(gulp.dest('./public/assets'));
});

gulp.watch('./assets/styles/**/*.less', ['less']);

// Server

gulp.task('server', function() {
  require('./server');
});
