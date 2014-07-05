(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    require("injectify/runtime").registerHelper("require", function (instance, options) {
        return instance;
    });

})();
