/*jshint node: true*/

//noinspection BadExpressionStatementJS
"use strict";

var through = require('through'),
    compiler = require('./compiler');

var extensions = {
    hbs: 1,
    handlebar: 1,
    handlebars: 1
};

/**
 * @param {String} file
 * @returns {Stream}
 */
function injectify(file) {
    if (!extensions[file.split(".").pop()]) {
        return through();
    }

    var buffer = "";

    return through(
        function (chunk) {
            buffer += chunk.toString();
        },
        function () {
            if (buffer.indexOf('/* prevent circular */') === 0) {
                this.queue(buffer);
            }
            else {
                this.queue(compiler.compile(buffer));
            }

            this.queue(null);
        });
}

injectify.extensions = extensions;

module.exports = injectify;
