/*jshint node: true*/

"use strict";

var through = require('through'),
    Handlebars = require("handlebars");

var extensions = {
    hbs: 1,
    handlebar: 1,
    handlebars: 1
};

var helpers = {
    "view": [0]
};

/**
 * @param {Object} ast
 * @returns {Object}
 */
function walk(ast) {
    ast.statements.forEach(function (node) {
        if (node.eligibleHelper) {
            var helperName = node.sexpr.id.string;
            if (helpers[helperName]) {
                helpers[helperName].forEach(function (paramIndex) {
                    var param = node.sexpr.params[paramIndex];

                    if (param) {
                        param.type = 'INTEGER';
                        param.integer = 'require("' + param.string + '")';
                    }
                });
            }
        }

        if (node.statements) {
            walk(ast);
        }
    });

    return ast;
}

/**
 * @param {String} buffer
 * @returns {Object}
 */
function parse(buffer) {
    return walk(Handlebars.parse(buffer));
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
            var compiled = "// hbsfy compiled Handlebars template\n";
            compiled += "var Handlebars = require('hbsfy/runtime');\n";
            compiled += "module.exports = Handlebars.template(" + compile(parse(buffer)) + ");\n";

            this.queue(compiled);
            this.queue(null);
        });
}

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
    extensions = {};
    newExtensions.forEach(function (ext) {
        extensions[ext] = 1;
    });

    return injectify;
};

/**
 * @param {String} name
 * @param {Number[]} indexes
 * @returns {injectify}
 */
injectify.addHelper = function (name, indexes) {
    helpers[name] = indexes;

    return injectify;
};

module.exports = injectify;

