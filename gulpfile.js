'use strict';

var gulp = require('gulp'),
    Server = require('karma').Server;

var watch = function (configPath, done) {
    new Server({
        configFile: configPath,
        autoWatch: true,
        singleRun: false
    }, done).start();
};

var test = function (configPath, done) {
    new Server({
        configFile: configPath,
        autoWatch: false,
        singleRun: true
    }, done).start();
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
