'use strict';

var injectify = require('../injectify'),
    Handlebars = require('handlebars');

Handlebars.Compiler.prototype.InjectifyString = function (param) {
    var escaped = JSON.stringify(param.original);

    this.opcode('pushLiteral', 'require(' + escaped + ')');
};

Handlebars.Compiler.prototype.InjectifyId = function (param) {
    console.warn('injectify over ID is not supported yet');
    this.ID(param);
};

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

    injectify.installPlugin(function (injectify) {
        injectify.walker.registerTransform('BlockStatement', requireString);
        injectify.walker.registerTransform('SubExpression', requireString);
        injectify.walker.registerTransform('MustacheStatement', requireString);
    });
};
