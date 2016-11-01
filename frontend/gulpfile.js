var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: 'localhost:80',
        browser: 'chrome'
    });
});

gulp.watch('./**/*.*', []).on('change', browserSync.reload);
