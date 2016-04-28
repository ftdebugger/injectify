module.exports = {
    entry: './spec/index.spec.js',

    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: '[name].bundle.js',
        chunkFilename: '[id].bundle.js',
        path: __dirname + '/dist'
    },
    devtool: 'inline-source-map',

    module: {
        loaders: [
            {test: /\.hbs/, loader: __dirname + '/index.js?{"test": 1}'}
        ]
    }
};
