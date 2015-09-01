'use strict';

/**
 * @param {{view: Backbone.View, _parent: *}} context
 * @returns {*}
 */
var getView = function (context) {
    if (context) {
        while (context && !context.view && context._parent) {
            context = context._parent;
        }

        return context ? context.view : null;
    }
};

var utils = {

    /**
     * @param {object} context
     * @param {[]} args
     * @returns {{module: function, options: {}, name: string, hash: {}, parentView: object}}
     */
    extractArguments: function (context, args) {
        var options = args.pop(),
            module = args.shift(),
            name, hash;

        if (args.length && typeof args[0] == 'string') {
            name = args.shift();
        }

        if (args.length && typeof args[0] == 'object') {
            hash = args.pop();
        }

        if (hash) {
            hash = _.extend({}, hash, options.hash);
        } else {
            hash = options.hash;
        }

        if (!name) {
            name = _.uniqueId('injectify');
        }

        return {
            module: utils.extractModule(module),
            options: options,
            name: name,
            hash: hash,
            parentView: this.extractView(context, hash, options)
        };
    },

    /**
     * It can be es6 module with no default export,
     * so we need to extract it
     *
     * @param moduleDefinition
     * @returns {*}
     */
    extractModule: function (moduleDefinition) {
        if (moduleDefinition && typeof moduleDefinition === 'object' && moduleDefinition.__esModule === true) {
            var moduleExports = _.toArray(_.omit(moduleDefinition, '__esModule'));

            if (moduleExports.length === 1) {
                return moduleExports[0];
            }
        }

        return moduleDefinition;
    },

    /**
     * Extract view
     *
     * @param context
     * @param hash
     * @param options
     * @returns {*}
     */
    extractView: function (context, hash, options) {
        var view;

        if (hash.view) {
            view = hash.view;
        } else {
            view = getView(context);

            if (!view && options.data) {
                view = getView(options.data);

                if (!view && options.data.root) {
                    view = getView(options.data.root)
                }
            }
        }

        return view;
    }

};

module.exports = utils;
