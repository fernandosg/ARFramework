var babelify = require('babelify');
var browserify = require('browserify');
var gulp=require("gulp");
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var order = require("gulp-order");
var watch=require('gulp-watch');
var bro=require("gulp-bro");
// var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('bundle', function() {
  return gulp.src(['./dist/arweb.js','./dist/js/libs/ar.js',,'./dist/js/libs/artoolkitsource.js'])
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


gulp.task('scripts', function() {
  gulp.src( 'src/arweb.js')
    .pipe(bro({
      transform: [
        babelify.configure({ presets: ['es2015'] })      
      ]
    }))
    .pipe(gulp.dest('dist'))
  });

gulp.task('default', ['scripts'], () => {
  watch(['./src/arweb.js','./src/class/*.js','./src/utils/*.js'], () => gulp.start('scripts') );
});
