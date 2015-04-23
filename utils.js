(function () {
    //noinspection BadExpressionStatementJS
    'use strict';

    var getView = function (context) {
        if (context) {
            while (context && !context.view && context.__parent__) {
                context = context.__parent__;
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
                name, hash, view;

            if (args.length && typeof args[0] == "string") {
                name = args.shift();
            }

            if (args.length && typeof args[0] == "object") {
                hash = args.pop();
            }

            if (hash) {
                hash = _.extend({}, hash, options.hash);
            }
            else {
                hash = options.hash;
            }

            if (!name) {
                name = _.uniqueId('injectify');
            }

            if (hash.view) {
                view = hash.view;
            }
            else {
                view = getView(context);

                if (!view && options.data && options.data.root) {
                    view = getView(options.data.root)
                }
                if (!view && options.data && options.data._parent) {
                    view = getView(options.data._parent.root)
                }
            }

            return {
                module: utils.extractModule(module),
                options: options,
                name: name,
                hash: hash,
                parentView: view
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
        }

    };

    module.exports = utils;

})();
