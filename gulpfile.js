/*jshint node: true*/

(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var gulp = require("gulp"),
        karma = require("karma").server;

    require("./");

    gulp.task('karma', function (done) {
        karma.start({
            configFile: __dirname + '/karma.conf.js',
            autoWatch: true,
            singleRun: false
        }, done);
    });

    gulp.task('test', function (done) {
        karma.start({
            configFile: __dirname + '/karma.conf.js',
            autoWatch: false,
            singleRun: true
        }, done);
    });

    gulp.task('default', ['karma']);

})();
