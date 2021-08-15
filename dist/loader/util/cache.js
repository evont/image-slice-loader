"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCachePath = exports.invalidCache = exports.setCache = exports.getImageCache = exports.compareCache = void 0;
var findCacheDir = require("find-cache-dir");
var os_1 = require("os");
var path = require("path");
var fs = require("fs-extra");
var constant_1 = require("./constant");
var CACHE_CONFIG = {
    cacheDirectory: findCacheDir({ name: constant_1.LOADER_NAME }) || os_1.tmpdir(),
    get cachePath() {
        return path.join(this.cacheDirectory, constant_1.CACHE_NAME);
    }
};
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
        tmpCache = fs.readJsonSync(CACHE_CONFIG.cachePath, { throws: false });
        return tmpCache;
    }
}
function getImageCache(imgHash, optionHash) {
    var cache = getCache();
    var result;
    if (cache && imgHash in cache) {
        var options = cache[imgHash].options;
        if (optionHash in options) {
            result = cache[imgHash];
        }
    }
    return result;
}
exports.getImageCache = getImageCache;
function setCache(data) {
    fs.outputJsonSync(CACHE_CONFIG.cachePath, data);
}
exports.setCache = setCache;
function invalidCache(newCache) {
    var oldCache = getCache();
    compareCache(newCache, oldCache);
}
exports.invalidCache = invalidCache;
function setCachePath(path) {
    if (!path)
        return;
    CACHE_CONFIG.cacheDirectory = path;
}
exports.setCachePath = setCachePath;
