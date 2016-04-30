'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var polyclean = require('polyclean');
var child = require('child_process');

var DIST = 'dist';
var TMP = '.tmp';

var dist = function(subpath) {
  return !subpath ? DIST : path.join(DIST, subpath);
};

// Copy files to dist
gulp.task('copy', function() {

  // Copy index.html
  var index = gulp.src('src/index.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(polyclean.uglifyJs())
    .pipe($.crisper({ scriptInHead: true }))
    .pipe($.replace('index.js', '/index.js'))
    .pipe(gulp.dest(dist()));

  // Copy webcomponents.js
  var vendor = gulp.src('src/vendor/webcomponentsjs/webcomponents-lite.min.js')
    .pipe(gulp.dest(dist('vendor/webcomponentsjs')));

  return merge(index, vendor)
    .pipe($.size({
      title: 'copy'
    }));
});

// 1. Vulcanize elements, generate shared.html
// 2. Rewrite imports, fix Windows path separator bug
gulp.task('vulcanize', function() {
  return gulp.src(['src/components/**/*.html'], { base: 'src', read: false })
    .pipe($.webComponentShards({
      root: 'src',
      shared: 'components/shared.html',
      bower_components: 'vendor',
      work: TMP + '/shards'
    }))
    .pipe($.replace('..\\', '../'))
    .pipe(gulp.dest(TMP))
    .pipe($.size({
      title: 'vulcanize'
    }));
});

// 1. Minify html, css & js
// 2. Put scripts from .html to external files
gulp.task('minify', function() {
  return gulp.src(TMP + '/components/**/*.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCss: true
    }))
    .pipe(polyclean.cleanCss())
    .pipe(polyclean.uglifyJs())
    .pipe($.crisper({
      scriptInHead: false
    }))
    .pipe(gulp.dest(dist('components')))
    .pipe($.size({
      title: 'minify'
    }));
});

// Clean output directory
gulp.task('clean', function() {
  return del(['.tmp', dist()]);
});

// Build production files
gulp.task('build', ['clean'], function(cb) {
  runSequence(
    'copy', 'vulcanize', 'minify',
    cb);
});

// Serve project from dist
gulp.task('serve:dist', function(done) {
  return child.spawn('ws.cmd', ['--directory=dist'], {stdio: 'inherit'})
    .on('close', done);
});

// Serve project from src
gulp.task('default', function(done) {
  return child.spawn('ws.cmd', ['--directory=src'], {stdio: 'inherit'})
    .on('close', done);
});
