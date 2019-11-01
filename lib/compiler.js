var Handlebars = require('handlebars');

/**
 * @param {String} buffer
 * @returns {Object}
 */
function parse(buffer) {
    return walker.walk(Handlebars.parse(buffer));
}

/**
 * @param {Object} ast
 * @param {{data: boolean, knownHelpers: {}, knownHelpersOnly: boolean}} options
 * @returns {String}
 */
function compile(ast, options) {
    var environment = new Handlebars.Compiler().compile(ast, options),
        js = new Handlebars.JavaScriptCompiler().compile(environment, options);

    return js.toString();
}

/**
 * @param {{bus: EventEmitter, walker: Walker}} options
 *
 * @constructor
 */
var Compiler = function (options) {
    this.bus = options.bus;
    this.walker = options.walker;

    this.bus.on('node', this._walk.bind(this));
    this.bus.on('source', this._wrap.bind(this));
};

Compiler.prototype = {

    /**
     * @param {{node: object}} event
     *
     * @private
     */
    _walk: function (event) {
        event.node = this.walker.walk(event.node);
    },

    /**
     * @param {{node: object}} event
     *
     * @private
     */
    _wrap: function (event) {
        var source = 'var Handlebars = require("handlebars/runtime");\n';
        source += 'module.exports = Handlebars.template(' + event.source + ');\n';

        event.source = source;
    },

    /**
     * @return {string}
     */
    compile: function (buffer, options) {
        var event = Object.assign({
            handlebarsOptions: {
                data: true
            }
        }, options);

        this.bus.emit('init', event);

        event.node = Handlebars.parse(buffer);
        this.bus.emit('node', event);

        event.source = compile(event.node, event.handlebarsOptions);
        this.bus.emit('source', event);
        this.bus.emit('done', event);

        return event.source;
    }

};

/**
 * @param {string} buffer
 * @returns {string}
 */
exports.compile = function (buffer, options) {
    return this.factory().compile(buffer, options);
};

/**
 * @params {{}} options
 * @returns {Compiler}
 */
exports.factory = function (options) {
    return new Compiler(options);
};
