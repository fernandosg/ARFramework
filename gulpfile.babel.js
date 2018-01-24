var browserify = require('browserify');
var gulp = require('gulp');

var babelify=require('babelify');
var sourcemaps=require('gulp-sourcemaps');

var watch=require('gulp-watch');
require('gulp-watch');
require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
gulp.task('scripts', () =>
  browserify('./src/arweb.js')
    .transform(babelify,{global:true,"presets": ["es2015"]})
    .bundle()
    .on('error', function(err){
      console.error(err);
      this.emit('end')
    })
    .pipe(source('src/'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'))
);

gulp.task('default', ['scripts'], () => {
  watch('./src/arweb.js', () => gulp.start('scripts') );
  watch('./src/**/*.js', () => gulp.start('scripts') );
});
