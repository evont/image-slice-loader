"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProperty = exports.transformAlias = exports.startsWith = exports.useNumOnly = void 0;
function useNumOnly(val, defaultVal) {
    if (defaultVal === void 0) { defaultVal = 0; }
    return val && Number.isNaN(+val) ? defaultVal : +val;
}
exports.useNumOnly = useNumOnly;
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
            onlyModule: onlyModule,
        }, typeof obj === "string"
            ? {
                alias: obj,
            }
            : obj);
        return result;
    });
}
exports.transformAlias = transformAlias;
function parseProperty(propValue) {
    var _a;
    // use example: [url, bgSize, slice, direction, isSep]
    // 1. long-bg: url(@assets/long-1.png) 375 300 column;
    // 2. long-bg: url(@assets/long-1.png) 375 [200, 400, 300];
    var reg = /url\(["']?(.*?)["']?\)/;
    var formateVal = propValue.replace(/(\d+,)\s?(?=\d)/g, "$1");
    var valArr = formateVal.split(" ");
    var url = ((_a = reg.exec(valArr[0])) === null || _a === void 0 ? void 0 : _a[1]) || "";
    var bgSize = useNumOnly(valArr[1]); // zero means use origin image size
    var slice = [300];
    if (valArr[2]) {
        slice = valArr[2]
            .split(",")
            .filter(Boolean)
            .map(function (num) { return useNumOnly(num, 500); });
    }
    var direction = "column";
    var isSeparate = false;
    var tmp = valArr[3];
    if (tmp === "column" || tmp === "row") {
        direction = tmp;
        if (valArr[4]) {
            tmp = valArr[4];
        }
        else {
            tmp = "";
        }
    }
    isSeparate = (tmp && tmp === "true") || false;
    return {
        url: url,
        bgSize: bgSize,
        slice: slice,
        direction: direction,
        isSeparate: isSeparate
    };
}
exports.parseProperty = parseProperty;
