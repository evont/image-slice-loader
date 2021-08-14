"use strict";
exports.__esModule = true;
exports.getHash = exports.getOutput = exports.getSlices = exports.transformPX = exports.useNumOnly = void 0;
var crypto_1 = require("crypto");
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
function getOutput(output, name, ind, hash) {
    var result;
    hash = hash.substr(0, 7);
    if (typeof output === "string") {
        result = output.replace(/\[name\]/g, name).replace(/\[index\]/g, "" + ind).replace(/\[hash\]/g, hash);
    }
    else {
        result = output(name, ind, hash);
    }
    return result;
}
exports.getOutput = getOutput;
function getHash(content) {
    var hash = crypto_1.createHash("md5");
    if (typeof content === "string") {
        hash.update(content, "utf-8");
    }
    else {
        hash.update(content);
    }
    return hash.digest("hex");
}
exports.getHash = getHash;
