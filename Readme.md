Injectify
=========

Inspired by [hbsfy](https://github.com/epeli/node-hbsfy) and based on it source code.

Transform handlebars AST and add support of `require` helper for browserify automatic injection;


Install
-------

```
npm install --save-dev injectify
```


Usage
-----

Use it as Browserify transform module with `-t`:

```
browserify -t hbsfy main.js > bundle.js
```

If you prefer `gulp`:

```js
    var gulp = require("gulp"),
        browserify = require("browserify"),
        source = require("vinyl-source-stream"),
        
    gulp.task('js', function () {
        var bundleStream = browserify('./src/index.js')
            .transform(require("injectify"))
            .bundle();

        return bundleStream
            .pipe(source('index.js'))
            .pipe(gulp.dest('dist'));
    });
```

In file `./src/index.js` require helper injectify helper:

```js
require("injectify/require");
```

Now you can use `require` helper in your templates:

```handlebars
<h1>Example</h1>

Simple require some module with string export: {{require "../string-module"}

Pass require result as param to another helper: {{formatUser (require "../user-module")}}

Pass require result as hash param to another helper: {{formatUser user=(require "../user-module")}}
```

`require` helper works like original `browserify`. You can require modules relative to template file or
node_modules directory


```handlebars
Relative require {{require "../utils/strange-module"} or globally defined {{require "my-utils"}}
```
