const gulp = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const useref = require('gulp-useref');
const csso = require('gulp-csso');
const browserSync = require('browser-sync').create();


const srcDir = './app';
const buildDir = './build';

const paths = {
    src: {
        js: srcDir + '/js/**/*.*',
        css: srcDir + '/css/**/*.*',
        templates: srcDir + '/templates/**/*.*',
        languages: srcDir + '/languages/**/*.*',
        fonts: srcDir + '/bower_components/bootstrap/fonts/**/*.*'
    },
    dest: {
        js: buildDir + '/js',
        css: buildDir + '/css',
        templates: buildDir + '/templates',
        languages: buildDir + '/languages',
        fonts: buildDir + '/fonts'
    }
};

gulp.task('templates', () => {
    return gulp.src(paths.src.templates)
        .pipe(gulp.dest(paths.dest.templates))
});

gulp.task('languages', () => {
    return gulp.src(paths.src.languages)
        .pipe(gulp.dest(paths.dest.languages))
});

gulp.task('fonts', () => {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
});

gulp.task('clean', () => {
    return gulp.src(buildDir + '/*', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean'], () => {
    gulp.start('languages', 'templates', 'fonts');
    return gulp.src(srcDir + '/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify({mangle: false})))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest(buildDir))
});

gulp.task('browserSync', () => {
    browserSync.init({
        proxy: 'localhost:80',
        ws: true,
        browser: 'chrome'
    });

    gulp.watch('./app/**/*.*').on('change', browserSync.reload);
});
