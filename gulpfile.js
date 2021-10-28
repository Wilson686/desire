"use strict";

/* Variables */
const {src, dest, watch, parallel, series} = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const rigger = require('gulp-rigger');
const cssBeautify = require('gulp-cssbeautify');
const autoPrefixer = require('gulp-autoprefixer');
const del = require('del');
const imagemin = require('gulp-imagemin');
const stripComments = require('gulp-strip-comments');
const panini = require("panini");

/* Paths */
const srcPath = 'src/';
const distPath = 'dist/';

const path = {
    build: {
        html:   distPath,
        js:     distPath + "assets/js/",
        css:    distPath + "assets/css/",
        images: distPath + "assets/images/",
        fonts:  distPath + "assets/fonts/"
    },
    src: {
        html:   srcPath + "*.html",
        js:     srcPath + "assets/js/*.js",
        css:    srcPath + "assets/scss/*.scss",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    watch: {
        html:   srcPath + "**/*.html",
        js:     srcPath + "assets/js/**/*.js",
        css:    srcPath + "assets/scss/**/*.scss",
        images: srcPath + "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts:  srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}"
    },
    clean: "./" + distPath
}

/* Tasks */

function server() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath + "/"
        },
        notify: false,
        port: 5000
    });
}

function html() {
    panini.refresh();
    return src(path.src.html, { base: "src/" })
        .pipe(plumber())
        .pipe(panini({
            root:       srcPath,
            layouts:    srcPath + 'layouts/',
            partials:   srcPath + 'partials/',
            helpers:    srcPath + 'helpers/',
            data:       srcPath + 'data/'
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
}

function css() {
    return src(path.src.css, { base: "src/assets/scss/" })
        .pipe(sass())
        .pipe(cssBeautify())
        .pipe(dest(path.build.css))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 8 version'],
            cascade: true
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest(path.build.css));
}

function cssWatch() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "SCSS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(concat('style.min.css'))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
}

function js() {
    return src(path.src.js, {base: srcPath + 'assets/js/'})
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(stripComments())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(dest(path.build.js));
}

function jsWatch() {
    return src(path.src.js, {base: srcPath + 'assets/js/'})
        .pipe(plumber({
            errorHandler : function(err) {
                notify.onError({
                    title:    "JS Error",
                    message:  "Error: <%= error.message %>"
                })(err);
                this.emit('end');
            }
        }))
        .pipe(rigger())
        .pipe(concat('app.min.js'))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
}

function images() {
    return src(path.src.images)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest(path.build.images));
}

function imagesWatch() {
    return src(path.src.images)
        .pipe(dest(path.build.images))
        .pipe(browserSync.stream());
}

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.stream());
}

function watching() {
  watch([path.watch.css], cssWatch);
  watch([path.watch.html], html);
  watch([path.watch.js], jsWatch);
  watch([path.watch.images], imagesWatch);
  watch([path.watch.fonts], fonts);
}

function clean() {
    return del(path.clean);
}

/* Подготовить готовый проэкт к продакшену */
const build = series(clean, parallel(html, css, js, images, fonts));

/* Exporst */
exports.server = server;
exports.html = html;
exports.css = css;
exports.cssWatch = cssWatch;
exports.js = js;
exports.jsWatch = jsWatch;
exports.images = images;
exports.imagesWatch = imagesWatch;
exports.fonts = fonts;

exports.build = build;

exports.watching = watching;
exports.default = parallel(cssWatch, jsWatch, imagesWatch, fonts, html, server, watching);