'use strict';

var _ = require('lodash'),
    source = require('vinyl-source-stream'),
    del = require('del'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    eslint = require('gulp-eslint'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    envify = require('envify/custom'),
    karma = require('karma');

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);
}

function rebundle(bundler, production) {
    var stream = bundler.bundle();
    return stream
        .on('error', handleErrors)
        .pipe(plumber())
        .pipe(gulpif(!production, source('activity_tree.js')))
        .pipe(gulpif(production, source('activity_tree.min.js')))
        .pipe(gulpif(production, streamify(uglify())))
        .pipe(gulp.dest('./static/js/build/'));
}

function buildScript(production) {
    process.env.NODE_ENV = production ? 'production' : 'development';

    var b = browserify({
        entries: ['./js/app.js'],
        debug: false,
        cache: {},
        packageCache: {}
    });

    var bundler = production ? b : watchify(b);
    bundler.transform(babelify).transform(envify());
    bundler.on('update', function () {
        rebundle(bundler, production);
        gutil.log('Rebundle ...');
    });

    return rebundle(bundler, production);
}

gulp.task('clean', function () {
    del('./static/js/build/');
});

gulp.task('lint', function () {
    return gulp.src(['./js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('build', function () {
    return buildScript(true);
});

gulp.task('watch', function () {
    return buildScript(false);
});

gulp.task('test', function (done) {
    return new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        reporters: ['spec'],
        singleRun: _.isUndefined(gutil.env.watch) ? true : false,
        browsers: _.isUndefined(gutil.env.browser) ? ['PhantomJS', 'Firefox', 'Chrome'] : [gutil.env.browser]
    }, function () {
        done();
    }).start();
});
