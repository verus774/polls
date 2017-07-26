const gulp = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const useref = require('gulp-useref');
const csso = require('gulp-csso');
const browserSync = require('browser-sync').create();
const inject = require('gulp-inject');
const rename = require('gulp-rename');
const bowerFiles = require('main-bower-files');
const angularFilesort = require('gulp-angular-filesort');
const chokidar = require('chokidar');

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

gulp.task('inject', () => {
    const injectBower = gulp.src(bowerFiles({
        paths: {
            bowerDirectory: srcDir + '/bower_components',
            bowerrc: './.bowerrc',
            bowerJson: './bower.json'
        }
    }), {read: false});

    const injectJs = gulp.src(paths.src.js).pipe(angularFilesort());
    const injectCss = gulp.src(paths.src.css, {read: false});

    return gulp.src(srcDir + '/index.html')
        .pipe(inject(injectBower, {name: 'bower', relative: true}))
        .pipe(inject(injectJs, {relative: true}))
        .pipe(inject(injectCss, {relative: true}))
        .pipe(gulp.dest(srcDir));
});

gulp.task('browserSync', ['inject'], () => {
    browserSync.init({
        proxy: 'localhost:80',
        ws: true,
        browser: 'chrome'
    });
});

gulp.task('serve', ['browserSync'], () => {
    const watcher = chokidar.watch(srcDir + '/**/*.*');
    watcher.on('ready', () => {
        watcher
            .on('add', () => gulp.start('inject'))
            .on('unlink', () => gulp.start('inject'))
            .on('change', () => browserSync.reload());
    });

});

gulp.task('default', ['serve']);
