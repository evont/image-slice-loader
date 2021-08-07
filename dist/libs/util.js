"use strict";
exports.__esModule = true;
exports.getSlices = exports.transformAlias = exports.transformPX = exports.useNumOnly = exports.startsWith = void 0;
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
function useNumOnly(val, defaultVal) {
    if (defaultVal === void 0) { defaultVal = 0; }
    return val && Number.isNaN(+val) ? defaultVal : +val;
}
exports.useNumOnly = useNumOnly;
function transformPX(obj, pick) {
    return (pick || Object.keys(obj)).reduce(function (prev, val) { return (val in obj &&
        (prev[val] = Number.isNaN(+obj[val]) ? obj[val] : obj[val] + "px"),
        prev); }, {});
}
exports.transformPX = transformPX;
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
function getSlices(size, arr) {
    if (!arr.length)
        return [size];
    var heights = [];
    var isMulti = arr.length > 1;
    while (size > 0) {
        var slice = isMulti ? arr.shift() || 0 : arr[0];
        if (size > slice && slice > 0) {
            heights.push(slice);
            size -= slice;
        }
        else {
            heights.push(size);
            size = 0;
        }
    }
    return heights;
}
exports.getSlices = getSlices;
