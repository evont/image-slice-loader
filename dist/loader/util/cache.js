"use strict";
exports.__esModule = true;
exports.invalidCache = exports.setCache = exports.getImageCache = exports.compareCache = void 0;
var findCacheDir = require("find-cache-dir");
var os_1 = require("os");
var path = require("path");
var fs = require("fs-extra");
var constant_1 = require("./constant");
var cacheDirectory = findCacheDir({ name: constant_1.LOADER_NAME }) || os_1.tmpdir();
var cachePath = path.join(cacheDirectory, constant_1.CACHE_NAME);
function removeOutput(bgs) {
    bgs === null || bgs === void 0 ? void 0 : bgs.forEach(function (bg) {
        try {
            fs.removeSync(bg.filePath);
        }
        catch (err) {
            void err;
        }
    });
}
function compareCache(newCache, oldCache) {
    if (!oldCache)
        return;
    for (var k in oldCache) {
        if (k in newCache) {
            var oldOpt = oldCache[k].options;
            var newOpt = newCache[k].options;
            for (var j in oldOpt) {
                if (j in newOpt) {
                    void 0;
                }
                else {
                    removeOutput(oldOpt[j].bgsResource);
                    delete oldOpt[j];
                }
            }
        }
        else {
            for (var j in oldCache[k].options) {
                removeOutput(oldCache[k].options[j].bgsResource);
            }
            delete oldCache[k];
        }
    }
}
exports.compareCache = compareCache;
var tmpCache;
function getCache() {
    if (tmpCache) {
        return tmpCache;
    }
    else {
        tmpCache = fs.readJsonSync(cachePath, { throws: false });
        return tmpCache;
    }
}
function getImageCache(imgHash, optionHash) {
    var cache = getCache();
    if (cache && imgHash in cache) {
        var options = cache[imgHash].options;
        if (optionHash in options) {
            return cache[imgHash];
        }
    }
}
exports.getImageCache = getImageCache;
function setCache(data) {
    fs.outputJsonSync(cachePath, data);
}
exports.setCache = setCache;
function invalidCache(newCache) {
    var oldCache = getCache();
    compareCache(newCache, oldCache);
}
exports.invalidCache = invalidCache;
