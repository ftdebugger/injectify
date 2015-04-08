/*jshint node: true*/

(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var gulp = require("gulp"),
        browserify = require("browserify"),
        source = require("vinyl-source-stream"),
        karma = require("gulp-karma");

    gulp.task('spec', function () {
        var bundleStream = browserify('./spec/index.spec.js')
            .transform(require("./index"))
            .bundle();

        return bundleStream
            .pipe(source('spec.js'))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('karma', ['spec'], function () {
        gulp.src('dist/spec.js').pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
    });

    gulp.task('watch', function () {
        gulp.watch(['spec/**'], ['karma']);
    });

    gulp.task('default', ['karma', 'watch']);

})();
