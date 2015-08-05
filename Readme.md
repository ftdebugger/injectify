Injectify [![Build Status](https://travis-ci.org/ftdebugger/injectify.svg?branch=master)](https://travis-ci.org/ftdebugger/injectify)
=========

Inspired by [hbsfy](https://github.com/epeli/node-hbsfy) and based on it source code.

Transform handlebars AST and add support of `require` helper for browserify/webpack automatic injection;


Install
-------

```
npm install --save-dev injectify
```


Use with browserify
-------------------

Use it as Browserify transform module with `-t`:

```
browserify -t injectify main.js > bundle.js
```

If you prefer `gulp`:

```js
    var gulp = require("gulp"),
        browserify = require("browserify"),
        source = require("vinyl-source-stream"),
        
    gulp.task('js', function () {
        var bundleStream = browserify('./src/main.js')
            .transform(require("injectify"))
            .bundle();

        return bundleStream
            .pipe(source('main.js'))
            .pipe(gulp.dest('dist'));
    });
```

Use with webpack
----------------

Configure webpack

```js
{
    "module": {
        "loaders": [
            {"test": /\.hbs/, "loader": "injectify"}
        ]
    }
}
```json

Load helper
-----------

In file `./src/main.js` require injectify `require` helper:

```js
require("injectify/require");
```

Now you can use `require` helper in your templates:

```handlebars
Simple require some module with string export: 

{{require "../string-module"}}

Pass require result as param to another helper: 

{{formatUser (require "../user-module")}}

Pass require result as hash param to another helper: 

{{formatUser user=(require "../user-module")}}
```

`require` helper works like original `browserify`. You can require modules relative to template file or
node_modules directory


```handlebars
Relative require {{require "../utils/strange-module"}} 

or globally defined {{require "my-utils"}}
```

Examples of usage
-----------------

 * [Include helper](https://github.com/ftdebugger/injectify-include) - allow include templates like partials, but with browserify
 * [View helper](https://github.com/ftdebugger/injectify-view) - allow render marionette view direct to template
