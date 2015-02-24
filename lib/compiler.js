var Handlebars = require("handlebars");

Handlebars.Compiler.prototype.InjectifyString = function (param) {
    this.opcode('pushLiteral', 'require("' + param.original + '")');
};

Handlebars.Compiler.prototype.InjectifyId = function (param) {
    console.warn("injectify over ID is not supported yet");
    this.ID(param);
};
