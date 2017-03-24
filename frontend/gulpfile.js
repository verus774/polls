const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('browserSync', () => {
    browserSync.init({
        proxy: 'localhost:80',
        ws: true,
        browser: 'chrome'
    });
});

gulp.watch('./app/**/*.*').on('change', browserSync.reload);