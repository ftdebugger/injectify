var transformers = {};

/**
 * @param {string} type
 * @param {Function} callback
 */
exports.registerTransform = function (type, callback) {
    this.getTransforms(type).push(callback);
};

/**
 * @param {string} type
 * @returns {Function[]}
 */
exports.getTransforms = function (type) {
    return transformers[type] = transformers[type] || [];
};
