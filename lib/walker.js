'use strict';

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
    this.transformers = {};
};

Walker.prototype = {

    /**
     * @param {string} type
     * @param {Function} callback
     */
    registerTransform: function (type, callback) {
        this.getTransforms(type).push(callback);
    },

    /**
     * @param {string} type
     * @returns {Function[]}
     */
    getTransforms: function (type) {
        return this.transformers[type] = this.transformers[type] || [];
    },

    /**
     * @param {Node} node
     */
    invokeTransforms: function (node) {
        return this.getTransforms(node.type)
            .reduce(function (node, transofrm) {
                return transofrm(node);
            }, node);
    },

    /**
     * Walk over tree
     *
     * @param {Node} node
     * @returns {Node}
     */
    walk: function (node) {
        if (!node) {
            return node;
        }

        if (node.type && this[node.type]) {
            node = this[node.type](node) || node;
        }

        node = this.invokeTransforms(node);

        return node;
    },

    /**
     * @param {Node[]} nodes
     * @returns {Node[]}
     */
    walkArray: function (nodes) {
        return nodes.map(this.walk, this);
    },

    /**
     * @param {NodeProgram} node
     * @returns {NodeProgram}
     */
    Program: function (node) {
        node.body = this.walkArray(node.body);

        return node;
    },

    /**
     * @param {NodeBlockStatement} node
     * @returns {NodeBlockStatement}
     */
    BlockStatement: function (node) {
        node.program = this.walk(node.program);
        node.inverse = this.walk(node.inverse);
        node.params = this.walkArray(node.params);
        node.hash = this.walk(node.hash);
        node.path = this.walk(node.path);

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
     * @returns {NodeMustache}
     */
    MustacheStatement: function (node) {
        node.path = this.walk(node.path);
        node.hash = this.walk(node.hash);
        node.params = this.walkArray(node.params);

        return node;
    },

    /**
     * @param {NodeHash} node
     * @returns {NodeHash}
     */
    Hash: function (node) {
        node.pairs = this.walkArray(node.pairs);
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
     * @returns {NodeHashPair}
     */
    HashPair: function (node) {
        node.value = this.walk(node.value);

        return node;
    },

    /**
     * @param {NodeSubExpression} node
     * @returns {NodeSubExpression}
     */
    SubExpression: function (node) {
        node.path = this.walk(node.path);
        node.hash = this.walk(node.hash);
        node.params = this.walkArray(node.params);

        return node;
    },

    /**
     * @param {NodeDecoratorBlock} node
     * @returns {NodeDecoratorBlock}
     */
    DecoratorBlock: function (node) {
        node.program = this.walk(node.program);
        node.inverse = this.walk(node.inverse);

        return node;
    },

    /**
     * @param {NodePartialStatement} node
     * @returns {NodePartialStatement}
     */
    PartialStatement: function (node) {
        node.params = this.walkArray(node.params);
        node.hash = this.walk(node.hash);

        return node;
    },

    /**
     * @param {NodePartialBlockStatement} node
     * @returns {NodePartialBlockStatement}
     */
    PartialBlockStatement: function (node) {
        node.params = this.walkArray(node.params);
        node.program = this.walk(node.program);
        node.hash = this.walk(node.hash);

        return node;
    }

};

exports.walk = function (node) {
    return new Walker().walk(node);
};

exports.factory = function () {
    return new Walker();
};
