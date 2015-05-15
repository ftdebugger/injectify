'use strict';

var compiler = require('./compiler'),
    defaultTransform = require('./transform/default');

module.exports = function (content) {
    this.cacheable();

    return compiler.compile(content);
};

defaultTransform.createTransform('require');
