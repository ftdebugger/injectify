require('../../../runtime').registerHelper('hashHelper', function (options) {
    return '!helper=' + options.hash.helper + '!';
});
