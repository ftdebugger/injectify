(function () {
    'use strict';

    var EventEmitter = require('events').EventEmitter,
        Compiler = require('./compiler'),
        Walker = require('./walker'),
        instance;

    /**
     * Injectify logic into handlebars templates
     *
     * @constructor
     */
    var Injectify = function (options) {
        this.bus = new EventEmitter();
        this.walker = Walker.factory();
        this.options = options || {};

        this.compiler = Compiler.factory({
            bus: this.bus,
            walker: this.walker
        });

        exports.bus.emit('init', this);
    };

    /**
     * @param {string} buffer
     * @returns {string}
     */
    Injectify.prototype.compile = function (buffer) {
        return this.compiler.compile(buffer);
    };

    /**
     * @returns {Injectify}
     */
    exports.factory = function (options) {
        return new Injectify(options);
    };

    /**
     * @returns {Injectify}
     */
    exports.compile = function (buffer, options) {
        if (!instance) {
            instance = this.factory(options);
        }

        return instance.compile(buffer);
    };

    /**
     * @param plugin
     */
    exports.installPlugin = function (plugin) {
        this.bus.on('init', plugin);
    };

    /**
     * Global bus
     *
     * @type {EventEmitter}
     */
    exports.bus = new EventEmitter();

})();
