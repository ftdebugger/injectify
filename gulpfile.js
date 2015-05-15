/*jshint node: true*/

(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    var gulp = require("gulp"),
        karma = require("karma").server;

    require("./");

    var watch = function (configPath, done) {
        karma.start({
            configFile: configPath,
            autoWatch: true,
            singleRun: false
        }, done);
    };

    var test = function (configPath, done) {
        karma.start({
            configFile: configPath,
            autoWatch: false,
            singleRun: true
        }, done);
    };

    gulp.task('karma:browserify', function (done) {
        watch(__dirname + '/karma.conf.js', done);
    });

    gulp.task('karma:webpack', function (done) {
        watch(__dirname + '/webpack.karma.conf.js', done);
    });

    gulp.task('test:browserify', function (done) {
        test(__dirname + '/karma.conf.js', done);
    });

    gulp.task('test:webpack', function (done) {
        test(__dirname + '/webpack.karma.conf.js', done);
    });

    gulp.task('karma', ['karma:browserify', 'karma:webpack']);
    gulp.task('test', ['test:browserify', 'test:webpack']);

    gulp.task('default', ['karma']);

})();
