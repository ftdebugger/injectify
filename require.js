(function () {
    //noinspection BadExpressionStatementJS
    "use strict";

    require("./runtime").registerHelper("require", function (instance, options) {
        return instance;
    });

})();
