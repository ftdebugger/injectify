/*jshint node: true*/

'use strict';

var requireSecondArgumentTransform = require('./lib/transform/requireSecondArgumentTransform'),
    browserifyTransform = require('./lib/browserifyTransform'),
    webpackLoader = require('./lib/webpackLoader');

/**
 * @param {string} data
 * @returns {*}
 */
var universalLoader = function (data) {
    if (this && this.cacheable) {
        return webpackLoader.call(this, data);
    } else {
        return browserifyTransform.call(this, data);
    }
};

/**
 * @param {string} helperName
 */
universalLoader.createTransform = function (helperName) {
    requireSecondArgumentTransform.createTransform(helperName);
};

requireSecondArgumentTransform.createTransform('require');

module.exports = universalLoader;
