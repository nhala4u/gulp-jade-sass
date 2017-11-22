"use strict"

var pkg = require('./package.json'),
    gulp = require('gulp'),
    path = require('path'),
    data = require('gulp-data'),
    jade = require('gulp-jade'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    minifyJS = require('gulp-minify'),
    uglify = require('gulp-uglify'),
    gulpSequence = require('gulp-sequence'),
    del = require('del'),
    browserSync = require('browser-sync').create();

/*
 * Change directories here
 */
var reload = browserSync.reload();
var AUTOPREFIXER_BROWSERS = [
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];
var settings = {
    sourceDir: './src/',
    publicDir: './dist/',
    sassDir: './src/styles/sass',
    cssDir: './dist/css',
    jsDir: './dist/js',
    vendorDir: './dist/vendors',
};

var vendor = {
    jquery: {
        version: '3.2.1',
        url: settings.sourceDir + 'vendors/jquery/3.2.1'
    },
    jqueryValidate: {
        version: '1.17.0',
        url: settings.sourceDir + 'vendors/jquery-validate'
    },
    bootstrap: {
        version: '3.3.7',
        url: settings.sourceDir + 'vendors/bootstrap/3.3.7'
    },
    awesome: {
        version: '4.7.0',
        url: settings.sourceDir + 'vendors/awesome/4.7.0'
    },
    slick: {
        version: '1.8.0',
        url: settings.sourceDir + 'vendors/slick'
    },
    placeholders: {
        version: '4.0.1',
        url: settings.sourceDir + 'vendors/placeholders'
    },
    modernizr: {
        version: '',
        url: settings.sourceDir + 'vendors/modernizr'
    }
};

function requireUncached($module) {
    delete require.cache[require.resolve($module)];
    return require($module);
};

/* 
 * Clean - ./dist 
 */
gulp.task('clean', function() {
    return del(['./dist'])
        .then(function(paths) {});
});

/**
 * Compile .jade files and pass in data from json file
 * matching file name. index.jade - index.jade.json
 */
gulp.task('jade', function() {
    gulp.src([
            settings.sourceDir + '*.jade'
        ])
        .pipe(data(function(file) {
            return requireUncached(settings.sourceDir + 'config/' + path.basename(file.path) + '.json');
        }))
        .pipe(jade())
        .pipe(gulp.dest(settings.publicDir))
        .pipe(browserSync.reload({ stream: true }));

});

gulp.task('js', function() {
    return gulp.src([
            settings.sourceDir + 'js/**/*.js'
        ])
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(settings.jsDir))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js:package', function() {
    return gulp.src([
            vendor.jquery.url + '/jquery.min.js',
            vendor.jqueryValidate.url + '/jquery.validate.min.js',
            vendor.bootstrap.url + '/javascripts/bootstrap.js',
            vendor.placeholders.url + '/placeholders.min.js',
            vendor.modernizr.url + '/modernizr.min.js',
            vendor.slick.url + '/slick.js'
        ])
        .pipe(concat('package.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(settings.vendorDir))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy', [], function() {
    gulp.src([
            // '!./src/vendors/*.sass',
            // settings.sourceDir + 'vendors/**/*',
            settings.sourceDir + 'images/**/*'
            // settings.sourceDir + 'i18n/*',
        ], {
            base: settings.sourceDir
        })
        .pipe(gulp.dest(settings.publicDir));

    gulp.src([
            vendor.bootstrap.url + '/fonts/**/*',
            vendor.awesome.url + '/fonts/**/*',
            settings.sourceDir + 'styles/fonts/**/*'
        ])
        .pipe(gulp.dest(settings.publicDir + '/fonts/'));
});

/**
 * Recompile .jade files and live reload the browser
 */
gulp.task('build', ['sass', 'sass:package', 'jade', 'js', 'js:package', 'copy'], reload);

/**
 * Wait for jade and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        port: 3333,
        server: './dist/',
        index: 'index.html',
        directory: false
    });
});

/**
 * Compile .scss files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function() {
    return gulp.src(settings.sassDir + '/style.scss')
        .pipe(sass({
            includePaths: settings.sassDir,
            outputStyle: 'compressed'
        }))
        .on('error', sass.logError)
        .pipe(prefix(AUTOPREFIXER_BROWSERS, { cascade: true }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(settings.cssDir))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass:package', function() {
    return gulp.src([settings.sassDir + '/vendors.scss'])
        .pipe(sass({
            includePaths: settings.sassDir,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(concat('package.min.css'))
        .pipe(gulp.dest(settings.vendorDir))
        .pipe(browserSync.reload({ stream: true }));
});

/**
 * Watch `.jade, .scss, .js, .json, .css` files run build then reload BrowserSync
 */
gulp.task('watch', [], function() {
    gulp.watch([
        settings.sourceDir + '*.jade',
        settings.sourceDir + 'components/**/*.jade',
        settings.sourceDir + 'components/**/*',
        settings.sourceDir + 'styles/css/**/*',
        settings.sourceDir + 'styles/sass/**/*',
        settings.sourceDir + 'js/**/*',
        settings.sourceDir + 'images/**/*',
        settings.sourceDir + 'i18n/**/*',
        settings.sourceDir + 'config/**/*.json',
        settings.sourceDir + 'vendors/**/*.scss'
    ], ['build']);
});

/**
 * Default task, running just `gulp server` will compile the sass, jade, js, browser-sync
 * Server task, running with `gulp browser-sync` & `gulp watch`
 */
gulp.task('default', ['server']);
gulp.task('server', ['browser-sync', 'watch']);