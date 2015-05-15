var Handlebars = require("handlebars"),
    walker = require('./walker');

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

Handlebars.Compiler.prototype.InjectifyString = function (param) {
    this.opcode('pushLiteral', 'require("' + param.original + '")');
};

Handlebars.Compiler.prototype.InjectifyId = function (param) {
    console.warn("injectify over ID is not supported yet");
    this.ID(param);
};

/**
 * @param {string} buffer
 * @constructor
 */
var Compiler = function (buffer) {
    this.buffer = buffer;
};

Compiler.prototype = {

    /**
     * @return {string}
     */
    compile: function () {
        this.walker = walker.factory();
        this.node = Handlebars.parse(this.buffer);

        var node = this.walker.walk(this.node);

        var compiled = "/* prevent circular */var Handlebars = require('handlebars/runtime');\n";
        compiled += "module.exports = Handlebars.template(" + compile(node) + ");\n";

        return compiled;
    }

};

/**
 * @param {string} buffer
 * @returns {string}
 */
exports.compile = function (buffer) {
    return this.factory(buffer).compile();
};

/**
 * @param {string} buffer
 * @returns {Compiler}
 */
exports.factory = function (buffer) {
    return new Compiler(buffer);
};
