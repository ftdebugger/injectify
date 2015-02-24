/*jshint node: true*/

//noinspection BadExpressionStatementJS
"use strict";

var through = require('through'),
    Handlebars = require("handlebars"),
    walker = require('./walker');

var extensions = {
    hbs: 1,
    handlebar: 1,
    handlebars: 1
};

/**
 * @param {String} buffer
 * @returns {Object}
 */
function parse(buffer) {
    return walker.walk(Handlebars.parse(buffer));
}

/**
 * @param {Object} ast
 * @returns {String}
 */
function compile(ast) {
    var options = {data: true},
        environment = new Handlebars.Compiler().compile(ast, options),
        js = new Handlebars.JavaScriptCompiler().compile(environment, options);

    return js.toString();
}

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
                var compiled = "/* prevent circular */var Handlebars = require('handlebars/runtime');\n";
                compiled += "module.exports = Handlebars.template(" + compile(parse(buffer)) + ");\n";

                this.queue(compiled);
            }

            this.queue(null);
        });
}

injectify.extensions = extensions;

module.exports = injectify;
