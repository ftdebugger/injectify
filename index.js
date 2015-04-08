/*jshint node: true*/

//noinspection BadExpressionStatementJS
"use strict";

var through = require('through'),
    Handlebars = require("handlebars");

var extensions = {
    hbs: 1,
    handlebar: 1,
    handlebars: 1
};

var helpers = {};

function processNode(node) {
    if (node.eligibleHelper) {
        var helperName = node.id.string;

        if (helpers[helperName]) {
            helpers[helperName].forEach(function (paramIndex) {
                var param = node.params[paramIndex];

                if (param) {
                    param.type = 'INTEGER';
                    param.integer = 'require("' + param.string + '")';
                }
            });
        }
    }
}

function walkPairs(pairs) {
    pairs.forEach(function (pair) {
        processNode(pair[1]);
        walk(pair[1]);
    });

    return pairs;
}

function walkNodes(nodes) {

    nodes.forEach(function (node) {
        processNode(node);
        walk(node);
    });

    return nodes;
}

/**
 * @param {Object} ast
 * @returns {Object}
 */
function walk(ast) {
    if (ast.statements) {
        ast.statements = walkNodes(ast.statements);
    }

    if (ast.hash && ast.hash.pairs) {
        ast.hash.pairs = walkPairs(ast.hash.pairs);
    }

    if (ast.params) {
        ast.params = walkNodes(ast.params);
    }

    if (ast.mustache) {
        processNode(ast.mustache);
        ast.mustache = walk(ast.mustache);
    }

    if (ast.program) {
        ast.program = walk(ast.program);
    }

    if (ast.inverse) {
        ast.inverse = walk(ast.inverse);
    }

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
            if (buffer.indexOf('/* prevent circular */') === 0) {
                this.queue(buffer);
            }
            else {
                var compiled = "/* prevent circular */var Handlebars = require('handlebars/runtime')['default'];\n";
                compiled += "module.exports = Handlebars.template(" + compile(parse(buffer)) + ");\n";

                this.queue(compiled);
            }

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

injectify.addHelper('require', [0]);

module.exports = injectify;
