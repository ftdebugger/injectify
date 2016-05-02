'use strict';

var ASTTransforms = require('./ASTTransforms').ASTTransforms;

/**
 * @param {{}} target
 * @returns {{}}
 */
var extend = function (target) {
    target = target || {};

    [].slice.call(arguments, 1).forEach(function (obj) {
        if (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    target[key] = obj[key];
                }
            }
        }
    });

    return target;
};

/**
 * @typedef {{type: string}} Node
 */
/**
 * @typedef {{type: string}} NodeCommentStatement
 */
/**
 * @typedef {{type: string, body: Node[]}} NodeProgram
 */
/**
 * @typedef {{type: string, params: Node[], hash: NodeHash}} NodePartialStatement
 */
/**
 * @typedef {{type: string, path: NodePath, params: Node[]}} NodeSubExpression
 */
/**
 * @typedef {{type: string, data: *, original: string, parts: string[], depth: number}} NodePath
 */
/**
 * @typedef {{type: string, pairs: Node[], path: NodePath}} NodeHash
 */
/**
 * @typedef {{type: string, value: Node, key: string}} NodeHashPair
 */
/**
 * @typedef {{type: string, hash: NodeHash, path: NodePath}} NodeMustache
 */
/**
 * @typedef {{type: string, params: Node[], program: Node, inverse: Node, path: *, hash: NodeHash}} NodeBlockStatement
 */
/**
 * @typedef {{type: string, params: Node[], program: Node, inverse: Node, path: *}} NodeDecoratorBlock
 */
/**
 * @typedef {{type: string, params: Node[], program: Node, path: *, hash: NodeHash}} NodePartialBlockStatement
 */

var Walker = function () {
    this.preTransforms = new ASTTransforms();
    this.postTransforms = new ASTTransforms();
};

Walker.prototype = {

    /**
     * @deprecated use registerPostTransform instead
     *
     * @param {string} type
     * @param {Function} callback
     */
    registerTransform: function (type, callback) {
        this.registerPostTransform(type, callback);
    },

    /**
     * @param {string} type
     * @param {Function} callback
     */
    registerPreTransform: function (type, callback) {
        this.preTransforms.register(type, callback);
    },

    /**
     * @param {string} type
     * @param {Function} callback
     */
    registerPostTransform: function (type, callback) {
        this.postTransforms.register(type, callback);
    },

    /**
     * @param {string} type
     * @returns {Function[]}
     */
    getTransforms: function (type) {
        return this.transformers[type] = this.transformers[type] || [];
    },

    /**
     * Walk over tree
     *
     * @param {Node} node
     * @param {{}} [options]
     *
     * @returns {Node}
     */
    walk: function (node, options) {
        options = options || {depth: 0};

        if (!node) {
            return node;
        }

        node = this.preTransforms.transform(node, options);

        if (node.type && this[node.type]) {
            node = this[node.type](node, options) || node;
        }

        return this.postTransforms.transform(node, options);
    },

    /**
     * @param {Node[]} nodes
     * @param {{}} [options]
     *
     * @returns {Node[]}
     */
    walkArray: function (nodes, options) {
        return nodes.map(function (node) {
            return this.walk(node, options);
        }, this);
    },

    /**
     * @param {NodeProgram} node
     * @param {{}} [options]
     *
     * @returns {NodeProgram}
     */
    Program: function (node, options) {
        node.body = this.walkArray(node.body, options);

        return node;
    },

    /**
     * @param {NodeBlockStatement} node
     * @param {{}} [options]
     *
     * @returns {NodeBlockStatement}
     */
    BlockStatement: function (node, options) {
        options = extend({}, options, {
            depth: options.depth + 1
        });

        node.program = this.walk(node.program, options);
        node.inverse = this.walk(node.inverse, options);
        node.params = this.walkArray(node.params, options);
        node.hash = this.walk(node.hash, options);
        node.path = this.walk(node.path, options);

        return node;
    },

    /**
     * @param {Node} node
     * @returns {Node}
     */
    ContentStatement: function (node) {
        return node;
    },

    /**
     * @param {NodeMustache} node
     * @param {{}} [options]
     *
     * @returns {NodeMustache}
     */
    MustacheStatement: function (node, options) {
        node.path = this.walk(node.path, options);
        node.hash = this.walk(node.hash, options);
        node.params = this.walkArray(node.params, options);

        return node;
    },

    /**
     * @param {NodeHash} node
     * @param {{}} [options]
     *
     * @returns {NodeHash}
     */
    Hash: function (node, options) {
        node.pairs = this.walkArray(node.pairs, options);
        return node;
    },

    /**
     * @param {NodeHash} node
     * @returns {NodeHash}
     */
    StringLiteral: function (node) {
        return node;
    },

    /**
     * @param {NodePath} node
     * @returns {NodePath}
     */
    PathExpression: function (node) {
        return node;
    },

    /**
     * @param {NodeCommentStatement} node
     * @returns {NodeCommentStatement}
     */
    CommentStatement: function (node) {
        return node;
    },

    /**
     * @param {NodeHashPair} node
     * @param {{}} [options]
     *
     * @returns {NodeHashPair}
     */
    HashPair: function (node, options) {
        node.value = this.walk(node.value, options);

        return node;
    },

    /**
     * @param {NodeSubExpression} node
     * @param {{}} [options]
     *
     * @returns {NodeSubExpression}
     */
    SubExpression: function (node, options) {
        node.path = this.walk(node.path, options);
        node.hash = this.walk(node.hash, options);
        node.params = this.walkArray(node.params, options);

        return node;
    },

    /**
     * @param {NodeDecoratorBlock} node
     * @param {{}} [options]
     *
     * @returns {NodeDecoratorBlock}
     */
    DecoratorBlock: function (node, options) {
        node.program = this.walk(node.program, options);
        node.inverse = this.walk(node.inverse, options);

        return node;
    },

    /**
     * @param {NodePartialStatement} node
     * @param {{}} [options]
     *
     * @returns {NodePartialStatement}
     */
    PartialStatement: function (node, options) {
        node.params = this.walkArray(node.params, options);
        node.hash = this.walk(node.hash, options);

        return node;
    },

    /**
     * @param {NodePartialBlockStatement} node
     * @param {{}} [options]
     *
     * @returns {NodePartialBlockStatement}
     */
    PartialBlockStatement: function (node, options) {
        node.params = this.walkArray(node.params, options);
        node.program = this.walk(node.program, options);
        node.hash = this.walk(node.hash, options);

        return node;
    }

};

exports.walk = function (node, options) {
    return new Walker().walk(node, options);
};

exports.factory = function () {
    return new Walker();
};
