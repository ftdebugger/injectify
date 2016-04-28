'use strict';

var injectify = require('./injectify');

module.exports = function (content, options) {
    this.cacheable();

    return injectify.compile(content, options);
};
