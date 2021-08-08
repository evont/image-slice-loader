"use strict";
exports.__esModule = true;
exports.setCache = exports.getCache = exports.invalidCache = void 0;
var findCacheDir = require("find-cache-dir");
var os_1 = require("os");
var path = require("path");
var fs = require("fs-extra");
var constant_1 = require("./constant");
var cacheDirectory = findCacheDir({ name: constant_1.LOADER_NAME }) || os_1.tmpdir();
var cachePath = path.join(cacheDirectory, constant_1.CACHE_NAME);
function invalidCache(newCache, oldCache) {
    if (!oldCache)
        return;
    var oKeys = Object.keys(oldCache);
    oKeys.forEach(function (key) {
        var _a, _b;
        if (!(key in newCache)) {
            (_b = (_a = oldCache[key]) === null || _a === void 0 ? void 0 : _a.bgs) === null || _b === void 0 ? void 0 : _b.map(function (bg) {
                try {
                    fs.removeSync(bg);
                }
                catch (err) {
                    void err;
                }
            });
        }
    });
}
exports.invalidCache = invalidCache;
function getCache() {
    return fs.readJsonSync(cachePath, { throws: false });
}
exports.getCache = getCache;
function setCache(data) {
    fs.outputJsonSync(cachePath, data);
}
exports.setCache = setCache;
