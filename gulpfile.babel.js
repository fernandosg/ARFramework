var babelify = require('babelify');
var browserify = require('browserify');
var gulp=require("gulp");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var order = require("gulp-order");
var watch=require('gulp-watch');
// var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('bundle', function() {
  return gulp.src(['./dist/js/arweb.js','./dist/js/libs/webcam.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});

var minify = require('gulp-minify');

gulp.task('build', function() {
  gulp.src('dist/bundle.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: []
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function () {
    var bundler = browserify({
        entries: 'src/arweb.js',
        debug: true
    });
    bundler.transform(babelify,{global:true,"presets": ["es2015"]});

    bundler.bundle()
        .on('error', function (err) { console.error(err); })
        .pipe(source('arweb.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(order([
          "/src/arweb.js",
          "/src/**/*.js"
        ]))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts'], () => {
  watch(['./src/arweb.js','./src/class/*.js','./src/utils/*.js'], () => gulp.start('scripts') );
});
