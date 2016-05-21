'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var polyclean = require('polyclean');
var cp = require('child_process');
var jsonfile = require('jsonfile');
var browserSync = require('browser-sync');

var DIST = 'dist';
var TMP = '.tmp';
var SERVER = 'node_modules/local-web-server/bin/cli.js';
var renamer = 'node_modules/renamer/bin/cli.js';

var packageJson = jsonfile.readFileSync('package.json');
var serverConfig = jsonfile.readFileSync('.local-web-server.json');
var APP_NAME = packageJson.name;

var dist = function(subpath) {
  return subpath ? path.join(DIST, subpath) : DIST;
};

// Add new core element
gulp.task('app:core', function() {
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
      outputFile = APP_NAME + '-' + name;
      outputPath = 'src/components/core/' + outputFile;
      fs.stat(outputPath, function(err) {
        if (!err) {
          throw new Error('Element already exists');
        }
      });
      source.pipe($.data({
        name: name,
        prefix: APP_NAME
      }))
      .pipe($.template())
      .pipe($.rename(outputFile + '.html'))
      .pipe(gulp.dest(outputPath));
    }));
});

// Add new page
gulp.task('app:page', function() {
  var source = gulp.src('templates/page/**/*.tpl');
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
      outputFile = APP_NAME + '-' + page + '-page';
      outputPath = 'src/components/pages/' + outputFile;
      fs.stat(outputPath, function(err) {
        if (!err) {
          throw new Error('Page already exists');
        }
      });
      source.pipe($.data({
        page: page,
        prefix: APP_NAME
      }))
      .pipe($.template())
      .pipe($.rename(function(path) {
        if (path.basename.indexOf('styles') !== -1) {
          path.basename = outputFile + '-styles';
        } else {
          path.basename = outputFile;
        }
        path.extname = '.html';
      }))
      .pipe(gulp.dest(outputPath));
    }));
});

// Change app name, rename files and folders, replace occurences
gulp.task('app:rename', function(done) {
  var reserved = ['app', 'core', 'dom', 'iron', 'paper', 'test'];
  var name;
  return gulp.src('*')
    .pipe($.prompt.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter new app name to use as namespace for elements:'
    }, function(res) {
      if (!res.name) {
        throw new Error('Namespace is empty');
      }
      if (reserved.indexOf(res.name) !== -1) {
        throw new Error(
          'Namespace is used by Polymer authors. Plese choose another one.'
        );
      }
      if (res.name === APP_NAME) {
        throw new Error('Namespace is the same, nothing to change.');
      }
      name = res.name;
      return cp.spawn('node',
        [
          renamer,
          '--find', APP_NAME,
          '--replace', name,
          'src/components/**/*'
        ],
        {stdio: 'inherit'})
        .on('error', function(err) {
          console.error(err);
        })
        .on('close', function() {
          var index = gulp.src('src/index.html')
            .pipe($.replace(APP_NAME, name))
            .pipe(gulp.dest('src'));

          var components = gulp.src('src/components/**/*')
            .pipe($.replace(APP_NAME, name))
            .pipe(gulp.dest('src/components'));

          var test = gulp.src('test/setup.html')
            .pipe($.replace(APP_NAME, name))
            .pipe(gulp.dest('test'));

          var packageJson = gulp.src('./package.json')
            .pipe($.jsonEditor({name: name}, {'end_with_newline': true}))
            .pipe(gulp.dest('.'));

         var bowerJson = gulp.src('./bower.json')
            .pipe($.jsonEditor({name: name}, {'end_with_newline': true}))
            .pipe(gulp.dest('.'));

          return merge(index, components, test, packageJson, bowerJson);
        });
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

// Serve project from dist. No livereload used
gulp.task('serve:dist', function(done) {
  return cp.spawn('node', [SERVER, '--directory=dist'], {stdio: 'inherit'})
    .on('close', done);
});

// Serve project from src
gulp.task('serve', function(done) {
  return cp.spawn('node', [SERVER, '--directory=src'], {stdio: 'inherit'})
    .on('close', done);
});

// Reload on changes
gulp.task('reload', function() {
  browserSync.reload();
});

// Proxy requests to local-web-server
gulp.task('browser-sync', function() {
  var files = [
    'src/components/**/*',
    'src/styles/**/*'
  ];
  return browserSync.init(files, {
    proxy: '127.0.0.1:' + serverConfig.port,
    open: true,
    injectChanges: true
  });
});

// Watch for changes and reload page
gulp.task('watch', function() {
  gulp.watch([
    'src/components/**/*',
    'src/styles/**/*'
  ], ['reload']);
});

gulp.task('default', ['browser-sync', 'serve', 'watch']);
