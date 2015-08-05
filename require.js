'use strict';

var utils = require('./utils');

require('./runtime').registerHelper('require', function (instance) {
    return utils.extractModule(instance);
});
