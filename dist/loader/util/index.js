"use strict";
exports.__esModule = true;
exports.transformAlias = exports.startsWith = void 0;
// enhanced-resolve/lib/AliasPlugin
function startsWith(string, searchString) {
    var stringLength = string.length;
    var searchLength = searchString.length;
    // early out if the search length is greater than the search string
    if (searchLength > stringLength) {
        return false;
    }
    var index = -1;
    while (++index < searchLength) {
        if (string.charCodeAt(index) !== searchString.charCodeAt(index)) {
            return false;
        }
    }
    return true;
}
exports.startsWith = startsWith;
function transformAlias(alias) {
    return Object.keys(alias).map(function (key) {
        var obj = alias[key];
        var onlyModule = false;
        var result;
        if (/\$$/.test(key)) {
            onlyModule = true;
            key = key.substr(0, key.length - 1);
        }
        result = Object.assign({
            name: key,
            onlyModule: onlyModule
        }, typeof obj === "string"
            ? {
                alias: obj
            }
            : obj);
        return result;
    });
}
exports.transformAlias = transformAlias;
