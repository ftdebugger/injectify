/**
 * @constructor
 */
var ASTTransforms = function() {
    this.transforms = {};
};

ASTTransforms.prototype = {

    /**
     * @param {Node} node
     * @param {{}} [options]
     */
    transform: function(node, options) {
        var type = node.type,
            transforms = this.getTransforms(type);

        for (var index = 0; index < transforms.length; index++) {
            node = transforms[index](node, options);
            
            if (node.type !== type) {
                return this.transform(node);
            }
        }
        
        return node;
    },

    /**
     * @param {string} type
     * @param {Function} callback
     */
    register: function (type, callback) {
        this.getTransforms(type).push(callback);
    },

    /**
     * @param {string} type
     * @returns {Function[]}
     */
    getTransforms: function (type) {
        return this.transforms[type] = this.transforms[type] || [];
    }
    
};

exports.ASTTransforms = ASTTransforms;