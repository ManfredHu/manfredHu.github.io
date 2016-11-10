// 引入 gulp
var gulp = require('gulp');
 
// 引入组件
var minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息
 
// 合并、压缩、重命名css
gulp.task('css', function() {
  return gulp.src('themes/manfredhu/source/vendor/all/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('themes/manfredhu/source/vendor/dest'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('themes/manfredhu/source/vendor/dest'))
    .pipe(notify({ message: 'css task ok' }));
});
 
// 检查js
gulp.task('lint', function() {
  return gulp.src('themes/manfredhu/source/vendor/all/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});
 
// 合并、压缩js文件
gulp.task('js', function() {
  return gulp.src('themes/manfredhu/source/vendor/all/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('themes/manfredhu/source/vendor/dest'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('themes/manfredhu/source/vendor/dest'))
    .pipe(notify({ message: 'js task ok' }));
});
 
// 默认任务
gulp.task('default', function(){
  gulp.run( 'css', 'lint', 'js');
});