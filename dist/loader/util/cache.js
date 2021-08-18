"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
    },
};
function removeOutput(bgs) {
    bgs === null || bgs === void 0 ? void 0 : bgs.forEach(function (bg) {
        try {
            fs.removeSync(typeof bg === 'string' ? bg : bg.resultPath);
        }
        catch (err) {
            void err;
        }
    });
}
function compareCache(newCache, oldCache) {
    if (!oldCache)
        return;
    var _loop_1 = function (k) {
        if (k in newCache) {
            var oldOpt = oldCache[k].options;
            var newOpt = newCache[k].options;
            var usedBgs = [];
            var removeBgs = [];
            for (var j in newOpt) {
                usedBgs.push.apply(usedBgs, newOpt[j].bgsResource.map(function (item) { return item.resultPath; }));
            }
            for (var j in oldOpt) {
                if (j in newOpt) {
                    void 0;
                }
                else {
                    removeBgs.push.apply(removeBgs, oldOpt[j].bgsResource.map(function (item) { return item.resultPath; }));
                    delete oldOpt[j];
                }
            }
            var uSet_1 = new Set(usedBgs);
            var rSet = new Set(removeBgs);
            var diff = new Set(__spreadArrays(Array.from(rSet)).filter(function (x) { return !uSet_1.has(x); }));
            removeOutput(Array.from(diff));
        }
        else {
            for (var j in oldCache[k].options) {
                removeOutput(oldCache[k].options[j].bgsResource);
            }
            delete oldCache[k];
        }
    };
    for (var k in oldCache) {
        _loop_1(k);
    }
}
exports.compareCache = compareCache;
var tmpCache;
function getCache() {
    tmpCache = fs.readJsonSync(CACHE_CONFIG.cachePath, { throws: false });
    return tmpCache;
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
