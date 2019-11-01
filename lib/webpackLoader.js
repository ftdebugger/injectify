'use strict';

var injectify = require('./injectify');

module.exports = function (content, options) {
    this.cacheable();

    return injectify.compile(content, Object.assign({}, options, {
        path: this.resourcePath,
    }));
};
