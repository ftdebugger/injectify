/*jshint node: true*/

'use strict';

var requireSecondArgumentTransform = require('./lib/transform/requireSecondArgumentTransform'),
    browserifyTransform = require('./lib/browserifyTransform'),
    webpackLoader = require('./lib/webpackLoader'),
    injectify = require('./lib/injectify');

/**
 * @param {string} data
 * @param {{}} [options]
 *
 * @returns {*}
 */
var universalLoader = function (data, options) {
    if (this && this.cacheable) {
        var query = this.query.slice(1);
        return webpackLoader.call(this, data, query ? JSON.parse(query) : {});
    } else {
        return browserifyTransform.call(this, data, options._flags.injectify);
    }
};

/**
 * @param {string} helperName
 */
universalLoader.createTransform = function (helperName) {
    requireSecondArgumentTransform.createTransform(helperName);
};

/**
 * @param {function} plugin
 */
universalLoader.installPlugin = function (plugin) {
    injectify.installPlugin(plugin);
};

requireSecondArgumentTransform.createTransform('require');

module.exports = universalLoader;
