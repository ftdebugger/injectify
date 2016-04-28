"use strict";

var through = require('through'),
    injectify = require('./injectify');

var extensions = {
    hbs: 1,
    handlebar: 1,
    handlebars: 1
};

/**
 * @param {String} file
 * @param {{}} [options]
 *
 * @returns {Stream}
 */
function browserifyTransform(file, options) {
    if (!extensions[file.split(".").pop()]) {
        return through();
    }

    var buffer = "";

    return through(
        function (chunk) {
            buffer += chunk.toString();
        },
        function () {
            var preventCircular = '/* prevent circular */';

            if (buffer.indexOf(preventCircular) === 0) {
                this.queue(buffer);
            } else {
                this.queue(preventCircular + injectify.compile(buffer, options));
            }

            this.queue(null);
        });
}

browserifyTransform.extensions = extensions;

/**
 * @param {{extensions: String[]}} opts
 * @returns {browserifyTransform}
 */
browserifyTransform.configure = function (opts) {
    if (opts.extensions) {
        this.setExtensions(opts.extensions);
    }

    return browserifyTransform;
};

/**
 * @param {String[]} newExtensions
 * @returns {browserifyTransform}
 */
browserifyTransform.setExtensions = function (newExtensions) {
    newExtensions.forEach(function (ext) {
        browserifyTransform.extensions[ext] = 1;
    });

    return browserifyTransform;
};

module.exports = browserifyTransform;
