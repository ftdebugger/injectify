//noinspection BadExpressionStatementJS
'use strict';

var transforms = require('../transforms');

/**
 * @param helperName
 */
exports.createTransform = function (helperName) {

    var requireString = function (node) {
        if (node.path && node.path.original === helperName) {
            var requiredString = node.params[0];

            if (requiredString.type === 'StringLiteral') {
                requiredString.type = 'InjectifyString';
            }
        }

        return node;
    };

    transforms.registerTransform('BlockStatement', requireString);
    transforms.registerTransform('SubExpression', requireString);
    transforms.registerTransform('MustacheStatement', requireString);

};
