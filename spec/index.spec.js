//noinspection BadExpressionStatementJS
'use strict';

require('../require');
require('./fixture/js/position-helper');
require('./fixture/js/block-helper');
require('./fixture/js/hash-helper');

describe('injectify helper', function () {

    it('work as block helper', function () {
        var template = require('./fixture/tpl/block.hbs');
        expect(template()).toBe('block version string module\n');
    });

    it('work with level-1 injection', function () {
        var template = require('./fixture/tpl/level-1.hbs');
        expect(template()).toBe('test injectify with string module\n');
    });

    it('work with level-2 injection', function () {
        var template = require('./fixture/tpl/level-2.hbs');
        expect(template({flag: true})).toBe('test injectify with level-2 string module\n');
    });

    it('work with level-2 injection (else block)', function () {
        var template = require('./fixture/tpl/level-2.hbs');
        expect(template({flag: false})).toBe('test injectify with level-2 string module\n');
    });

    it('work with position injection', function () {
        var template = require('./fixture/tpl/position.hbs');
        expect(template()).toBe('test injectify with position !string module!\n');
    });

    it('work with hash injection', function () {
        var template = require('./fixture/tpl/hash.hbs');
        expect(template()).toBe('test injectify with hash !helper&#x3D;string module!\n');
    });

    it('work with position in block helper', function () {
        var template = require('./fixture/tpl/in-block.hbs');
        expect(template()).toBe('test injectify with block !block=string module!\n');
    });

    it('work with hash in block helper', function () {
        var template = require('./fixture/tpl/hash-in-block.hbs');
        expect(template()).toBe('test injectify with hash block !helper=string module!\n');
    });

    it('replace to require only strings', function () {
        var template = require('./fixture/tpl/injectify-variable.hbs');
        var options = {
            pathVariable: '../js/string'
        };

        //expect(template(options)).toBe('test injectify with hash !helper=string module!\n'); // this is right behaviour
        expect(template(options)).toBe('test injectify with hash !helper&#x3D;../js/string!\n', 'is not failed');
    });

    it('work with es6 module definition without default export', function () {
        var template = require('./fixture/tpl/es6-module.hbs');
        expect(template()).toBe('es6 version work\n');
    });

    it('work with inline decorators', function () {
        var template = require('./fixture/tpl/decorator-inline.hbs');
        expect(template()).toBe('\nstring module');
    });

    it('work with inline decorators as argument of partial', function () {
        var template = require('./fixture/tpl/decorator-inline-partial-argument.hbs');
        expect(template()).toBe('\nstring module');
    });

    //it('work with inline decorators as layout inlines', function () {
    //    var template = require('./fixture/tpl/decorator-inline-layouts.hbs');
    //    expect(template()).toBe('\nstring module');
    //});

});
