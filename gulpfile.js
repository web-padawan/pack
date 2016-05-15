'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var polyclean = require('polyclean');
var child = require('child_process');

var DIST = 'dist';
var TMP = '.tmp';
var APP_PREFIX = 'pb';
var SERVER = 'node_modules/local-web-server/bin/cli.js';

var dist = function(subpath) {
  return subpath ? path.join(DIST, subpath) : DIST;
};

// Add new core element
gulp.task('add:core', function() {
  var source = gulp.src('templates/core/core-template.tpl');
  var name;
  var outputPath;
  var outputFile;

  return gulp.src('*')
    .pipe($.prompt.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter element name:'
    }, function(res) {
      if (!res.name) {
        throw new Error('Element name is empty');
      }
      name = res.name;
      outputFile = APP_PREFIX + '-' + name;
      outputPath = 'src/components/core/' + outputFile;
      fs.stat(outputPath, function(err) {
        if (!err) {
          throw new Error('Element already exists');
        }
      });
      source.pipe($.data({
        name: name
      }))
      .pipe($.swig())
      .pipe($.rename(outputFile + '.html'))
      .pipe(gulp.dest(outputPath));
    }));
});

// Add new page
gulp.task('add:page', function() {
  var source = gulp.src('templates/page/page-template.tpl');
  var page;
  var outputPath;
  var outputFile;

  return gulp.src('*')
    .pipe($.prompt.prompt({
      type: 'input',
      name: 'page',
      message: 'Enter page name:'
    }, function(res) {
      if (!res.page) {
        throw new Error('Page name is empty');
      }
      page = res.page;
      outputFile = APP_PREFIX + '-' + page + '-page';
      outputPath = 'src/components/pages/' + outputFile;
      fs.stat(outputPath, function(err) {
        if (!err) {
          throw new Error('Page already exists');
        }
      });
      source.pipe($.data({
        page: page
      }))
      .pipe($.swig())
      .pipe($.rename(outputFile + '.html'))
      .pipe(gulp.dest(outputPath));
    }));
});

// Copy files to dist and .tmp
gulp.task('copy', function() {
  // Copy index.html
  var index = gulp.src('src/index.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(polyclean.uglifyJs())
    .pipe($.crisper({
      scriptInHead: true
    }))
    .pipe($.replace('index.js', '/index.js'))
    .pipe(gulp.dest(dist()));

  // Copy favicon.ico
  var favicon = gulp.src('src/resources/favicon.ico')
    .pipe(gulp.dest(dist('resources')));

  // Copy webcomponents.js
  var vendor = gulp.src('src/vendor/webcomponentsjs/webcomponents-lite.min.js')
    .pipe(gulp.dest(dist('vendor/webcomponentsjs')));

  return merge(index, vendor, favicon)
    .pipe($.size({
      title: 'copy'
    }));
});

// Copy fonts to dist
gulp.task('fonts', function() {
  return gulp.src('src/vendor/font-roboto/**/*.ttf')
    .pipe($.ttf2woff())
    .pipe(gulp.dest(dist('vendor/font-roboto')))
    .pipe($.size({
      title: 'fonts'
    }));
});

// 1. Vulcanize elements, generate shared.html
// 2. Rewrite imports, fix Windows path separator bug
// 3. Rewrite .ttf to .woff
gulp.task('vulcanize', function() {
  var components = gulp.src('src/components/{app,pages}/**/*.html', { base: 'src', read: false })
    .pipe($.webComponentShards({
      root: 'src',
      shared: 'components/shared.html',
      bower_components: 'vendor',
      work: TMP + '/shards'
    }))
    .pipe($.replace('..\\', '../'))
    .pipe(gulp.dest(TMP));

  var styles = gulp.src('src/styles/shared-styles.html')
    .pipe($.vulcanize())
    .pipe($.replace('.ttf', '.woff'))
    .pipe(gulp.dest(TMP + '/styles'));

  return merge(components, styles)
    .pipe($.size({
      title: 'vulcanize'
    }));
});

// 1. Minify html, css & js
// 2. Put scripts from .html to external files
gulp.task('minify', function() {
  return gulp.src(TMP + '/{components,styles}/**/*.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true
    }))
    .pipe(polyclean.uglifyJs())
    .pipe($.crisper({
      scriptInHead: false
    }))
    .pipe(gulp.dest(dist()))
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
    ['copy', 'fonts'],
    'vulcanize',
    'minify',
    cb);
});

// Serve project from dist
gulp.task('serve:dist', function(done) {
  return child.spawn('node', [SERVER, '--directory=dist'], {stdio: 'inherit'})
    .on('close', done);
});

// Serve project from src
gulp.task('default', function(done) {
  return child.spawn('node', [SERVER, '--directory=src'], {stdio: 'inherit'})
    .on('close', done);
});
