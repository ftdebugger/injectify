require("../require");
require("./fixture/js/position-helper");
require("./fixture/js/block-helper");
require("./fixture/js/hash-helper");

describe("injectify helper", function () {

    it("work with level-1 injection", function () {
        var template = require("./fixture/tpl/level-1.hbs");
        expect(template()).toBe("test injectify with string module\n");
    });

    it("work with level-2 injection", function () {
        var template = require("./fixture/tpl/level-2.hbs");
        expect(template({flag: true})).toBe("test injectify with level-2 string module\n");
    });

    it("work with position injection", function () {
        var template = require("./fixture/tpl/position.hbs");
        expect(template()).toBe("test injectify with position !string module!\n");
    });

    it("work with hash injection", function () {
        var template = require("./fixture/tpl/hash.hbs");
        expect(template()).toBe("test injectify with hash !helper=string module!\n");
    });

    it("work with position block helper", function () {
        var template = require("./fixture/tpl/block.hbs");
        expect(template()).toBe("test injectify with block !block=string module!\n");
    });

});
