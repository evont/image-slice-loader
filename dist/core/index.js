"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputSharp = exports.sharps = void 0;
var image_size_1 = require("image-size");
var sharp = require("sharp");
var path = require("path");
var fs = require("fs-extra");
var util_1 = require("./util");
function sharpPic(image, options, dimension) {
    var direction = options.direction, slice = options.slice;
    if (typeof slice === "number")
        slice = [slice];
    var isRow = direction === "row";
    try {
        dimension = dimension || image_size_1.default(image);
        var imgWidth_1 = dimension.width, imgHeight_1 = dimension.height;
        var imgSize = isRow ? imgWidth_1 : imgHeight_1;
        var sliceArr = util_1.getSlices(imgSize, slice);
        var offsetX_1 = 0;
        var offsetY_1 = 0;
        return {
            dimension: dimension,
            image: image,
            isRow: isRow,
            sliceArr: sliceArr,
            tasks: sliceArr.map(function (slice, ind) {
                var width = isRow ? slice : imgWidth_1;
                var height = isRow ? imgHeight_1 : slice;
                var left = offsetX_1;
                var top = offsetY_1;
                offsetX_1 += isRow ? width : 0;
                offsetY_1 += isRow ? 0 : height;
                var info = {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                };
                var hash = util_1.getHash([ind, left, top, width, height].join("-"));
                return {
                    info: info,
                    slice: slice,
                    extra: function () { return sharp(image).extract(info); },
                    hash: hash,
                };
            }),
        };
    }
    catch (e) {
        throw e;
    }
}
function sharps(images) {
    return images
        .map(function (_a) {
        var image = _a.image, options = _a.options;
        return sharpPic(image, options);
    })
        .filter(Boolean);
}
exports.sharps = sharps;
function outputSharp(images, options, dimension) {
    var outputPath = options.outputPath, output = options.output, urlPath = options.urlPath, cacheMatch = options.cacheMatch;
    fs.ensureDirSync(outputPath);
    function deal(sharpsTask) {
        var _this = this;
        var dimension = sharpsTask.dimension, tasks = sharpsTask.tasks, image = sharpsTask.image, sliceArr = sharpsTask.sliceArr, isRow = sharpsTask.isRow;
        var name = Buffer.isBuffer(image)
            ? util_1.getHash(image).substr(0, 7)
            : path.basename(image, path.extname(image));
        return {
            dimension: dimension,
            isRow: isRow,
            image: image,
            sliceArr: sliceArr,
            results: tasks.map(function (task, index) { return __awaiter(_this, void 0, void 0, function () {
                var info, extra, hash, matchItem, extraFn, data, fileHash, fileName, itemBase, resultPath, url;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            info = task.info, extra = task.extra, hash = task.hash;
                            matchItem = cacheMatch && cacheMatch({ info: info, hash: hash });
                            if (!matchItem) return [3 /*break*/, 1];
                            return [2 /*return*/, matchItem];
                        case 1:
                            extraFn = extra();
                            return [4 /*yield*/, extraFn.toBuffer({ resolveWithObject: true })];
                        case 2:
                            data = (_a.sent()).data;
                            fileHash = util_1.getHash(data);
                            fileName = util_1.getOutput(output, name, index, fileHash);
                            itemBase = fileName + "." + dimension.type;
                            resultPath = path.resolve(outputPath, itemBase);
                            url = path.join(urlPath || outputPath, itemBase);
                            return [4 /*yield*/, extraFn.toFile(resultPath)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    resultPath: resultPath,
                                    url: url,
                                    info: info,
                                    index: index,
                                    hash: hash,
                                }];
                    }
                });
            }); }),
        };
    }
    try {
        if (Array.isArray(images)) {
            var sharpsTasks = sharps(images);
            return sharpsTasks.map(function (sharpsTask) { return deal(sharpsTask); });
        }
        else {
            var _a = images, image = _a.image, options_1 = _a.options;
            return deal(sharpPic(image, options_1, dimension));
        }
    }
    catch (e) {
        throw e;
    }
}
exports.outputSharp = outputSharp;
