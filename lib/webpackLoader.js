'use strict';

var injectify = require('./injectify');

module.exports = function (content) {
    this.cacheable();

    return injectify.compile(content);
};
