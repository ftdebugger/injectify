//noinspection BadExpressionStatementJS
'use strict';

var transforms = require('./transforms');

/**
 * @typedef {{type: string}} Node
 * @typedef {{type: string, body: Node[]}} NodeProgram
 * @typedef {{type: string, path: NodePath, params: Node[]}} NodeSubExpression
 * @typedef {{type: string, data: *, original: string, parts: string[], depth: number}} NodePath
 * @typedef {{type: string, pairs: Node[], path: NodePath}} NodeHash
 * @typedef {{type: string, value: Node, key: string}} NodeHashPair
 * @typedef {{type: string, hash: NodeHash, path: NodePath}} NodeMustache
 * @typedef {{type: string, params: Node[], program: Node, inverse: Node, path: *, hash: NodeHash}} NodeBlockStatement
 */

var Walker = function () {
};

Walker.prototype = {

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
            node = this[node.type](node);
            node = transforms.getTransforms(node.type)
                .reduce(function (node, transofrm) {
                    return transofrm(node);
                }, node);

            return node;
        }

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
    }

};

exports.walk = function (node) {
    return new Walker().walk(node);
};

exports.factory = function () {
    return new Walker();
};
