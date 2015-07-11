var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    del = require('del'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('clean:dist', function (cb) {
  del(['dist/**'], cb);
});

gulp.task('jshint:tests', function () {
  return gulp.src(['test/**/*.js'])
    .pipe(jshint('./test/.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('jshint:code', function () {
  return gulp.src(['gulpfile.js', './lib/**/*.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('mochaTest', ['jshint:tests', 'jshint:code'], function () {
  return gulp.src('test/**/*.test.js', {read: false})
    .pipe(mocha({reporter: 'dot'}));
});

gulp.task('build', function() {
  return browserify({
    buildins: false,
    entries: ['./lib/index.js'],
    standalone: 'splitter',
    insertGlobals: false
  })
  .bundle()
  .pipe(source('sms-splitter.js'))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['jshint:tests', 'jshint:code', 'mochaTest', 'clean:dist', 'build']);
