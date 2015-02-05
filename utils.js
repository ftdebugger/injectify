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

    module.exports = {

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
                module: module,
                options: options,
                name: name,
                hash: hash,
                parentView: view
            };
        }

    };

})();
