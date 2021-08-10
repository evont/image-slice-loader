"use strict";
exports.__esModule = true;
exports.setCache = exports.getCache = exports.getCacheV2 = exports.invalidateV2 = exports.invalidCache = void 0;
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
function removeOutput(bgs) {
    bgs === null || bgs === void 0 ? void 0 : bgs.forEach(function (bg) {
        try {
            fs.removeSync(bg);
        }
        catch (err) {
            void err;
        }
    });
}
// const oldCache = {
//   '001': {
//     option: {
//       "0001": {
//         bgs: new Array(10).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//       "0002": {
//         bgs: new Array(4).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//     }
//   },
//   '002': {
//     width: 200,
//     height: 300,
//     option: {
//       "0001": {
//         bgs: new Array(10).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//       "0002": {
//         bgs: new Array(4).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//     }
//   }
// };
// const newCache = {
//   '002': {
//     width: 200,
//     height: 300,
//     option: {
//       "0001": {
//         bgs: new Array(10).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//     }
//   }
// };
function invalidateV2(newCache, oldCache) {
    if (!oldCache)
        return;
    for (var k in oldCache) {
        console.log(k, k in newCache);
        if (k in newCache) {
            var oldOpt = oldCache[k].option;
            var newOpt = newCache[k].option;
            for (var j in oldOpt) {
                if (j in newOpt) {
                    console.log(k + "-" + j + " is not modify in new cache");
                }
                else {
                    removeOutput(oldOpt[j].bgs);
                    delete oldOpt[j];
                }
            }
        }
        else {
            console.log(oldCache[k].option);
            for (var j in oldCache[k].option) {
                console.log("removing " + k + "-" + j + " in old");
                removeOutput(oldCache[k].option[j].bgs);
            }
            delete oldCache[k];
        }
    }
}
exports.invalidateV2 = invalidateV2;
function getCacheV2(imgHash, optionHash) {
    var cache = fs.readJsonSync(cachePath, { throws: false });
    if (cache && imgHash in cache) {
        var options = cache[imgHash].options;
        if (optionHash in options) {
            return cache[imgHash];
        }
    }
}
exports.getCacheV2 = getCacheV2;
function getCache() {
    return fs.readJsonSync(cachePath, { throws: false });
}
exports.getCache = getCache;
function setCache(data) {
    fs.outputJsonSync(cachePath, data);
}
exports.setCache = setCache;
