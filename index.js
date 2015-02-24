/*jshint node: true*/

//noinspection BadExpressionStatementJS
"use strict";

require('./lib/compiler');

var defaultTransform = require('./lib/transform/default'),
    injectify = require('./lib/helper');

/**
 * @param {{extensions: String[]}} opts
 * @returns {injectify}
 */
injectify.configure = function (opts) {
    if (opts.extensions) {
        this.setExtensions(opts.extensions);
    }

    return injectify;
};

/**
 * @param {String[]} newExtensions
 * @returns {injectify}
 */
injectify.setExtensions = function (newExtensions) {
    newExtensions.forEach(function (ext) {
        injectify.extensions[ext] = 1;
    });

    return injectify;
};

/**
 * @param {string} helperName
 */
injectify.createTransform = function (helperName) {
    defaultTransform.createTransform(helperName);
};

defaultTransform.createTransform('require');

module.exports = injectify;
