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
var path = require("path");
var fs = require("fs-extra");
var util_1 = require("../core/util");
var util_2 = require("./util");
var cache_1 = require("./util/cache");
var index_1 = require("../core/index");
exports.default = (function (_a) {
    var loaderContext = _a.loaderContext, options = _a.options;
    var cache = {};
    var property = options.property, output = options.output, outputPath = options.outputPath, template = options.template;
    var PostcssPlugin = function () {
        var compilerOptions = loaderContext._compiler.options;
        var _alias = compilerOptions.resolve.alias;
        var _context = compilerOptions.context || loaderContext.rootContext;
        var alias = util_2.transformAlias(_alias);
        var realOutput = outputPath;
        // if output path is match alias, transform into alias path
        for (var _i = 0, alias_1 = alias; _i < alias_1.length; _i++) {
            var item = alias_1[_i];
            if (outputPath === item.name ||
                (!item.onlyModule && util_2.startsWith(outputPath, item.name + "/"))) {
                if (outputPath !== item.alias &&
                    !util_2.startsWith(outputPath, item.alias + "/")) {
                    realOutput = item.alias + outputPath.substr(item.name.length);
                }
            }
        }
        // if not alias or not absolute path, transform into path relate to webpack context
        if (!path.isAbsolute(realOutput)) {
            realOutput = path.resolve(_context, realOutput);
            outputPath = path.resolve(_context, outputPath);
        }
        fs.ensureDirSync(realOutput);
        var oldCacheOption = {};
        return {
            postcssPlugin: "image-slice-parser",
            Declaration: function (decl) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function () {
                    var _c, url_1, direction, isSep, slice, bgSize, filePath, err_1, fileHash, optionHash, oldCache, cacheOption, currentOption, bgs, bgsResource_1, _imgWidth, _imgHeight, _isRow, scale, cacheDimension, _options, _imgWidth_1, _imgHeight_1, _d, _bgsResource, _dimension, outputs, dimension, isRow, results, sliceArr, imgHeight, imgWidth, _loop_1, _i, results_1, result, e_1, localCss;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!(decl.prop === property)) return [3 /*break*/, 12];
                                _c = util_2.parseProperty(decl.value), url_1 = _c.url, direction = _c.direction, isSep = _c.isSep, slice = _c.slice, bgSize = _c.bgSize;
                                if (!url_1)
                                    return [2 /*return*/];
                                filePath = void 0;
                                _f.label = 1;
                            case 1:
                                _f.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        return loaderContext.resolve(loaderContext.context, url_1, function (err, result) {
                                            return err ? reject(err) : resolve(result);
                                        });
                                    })];
                            case 2:
                                filePath = _f.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _f.sent();
                                throw new Error(url_1 + " can't be loaded, Please use a correct file path");
                            case 4:
                                if (!filePath)
                                    return [2 /*return*/];
                                fileHash = util_1.getHash(fs.readFileSync(filePath));
                                optionHash = util_1.getHash([direction, slice.join(",")].join("-"));
                                oldCache = cache_1.getImageCache(fileHash, optionHash);
                                cacheOption = {};
                                currentOption = {};
                                bgs = [];
                                bgsResource_1 = [];
                                _imgWidth = 0;
                                _imgHeight = 0;
                                _isRow = false;
                                scale = 1;
                                cacheDimension = void 0;
                                if (oldCache) {
                                    _options = oldCache.options, _imgWidth_1 = oldCache.imgWidth, _imgHeight_1 = oldCache.imgHeight;
                                    cache[fileHash] = Object.assign(cache[fileHash] || {}, {
                                        options: Object.assign(((_a = cache[fileHash]) === null || _a === void 0 ? void 0 : _a.options) || {}, (_e = {},
                                            _e[optionHash] = _options[optionHash],
                                            _e)),
                                        imgWidth: _imgWidth_1,
                                        imgHeight: _imgHeight_1,
                                    });
                                    cacheOption = cache[fileHash].options;
                                    _d = _options[optionHash], _bgsResource = _d.bgsResource, _dimension = _d.dimension;
                                    bgsResource_1 = _bgsResource;
                                    if (_dimension)
                                        cacheDimension = _dimension;
                                    Object.assign(currentOption, cacheOption[optionHash]);
                                }
                                else {
                                    cacheOption[optionHash] = currentOption;
                                }
                                _f.label = 5;
                            case 5:
                                _f.trys.push([5, 10, , 11]);
                                outputs = index_1.outputSharp({
                                    image: filePath,
                                    options: {
                                        direction: direction,
                                        slice: slice,
                                    },
                                }, {
                                    output: output,
                                    outputPath: realOutput,
                                    urlPath: outputPath,
                                    cacheMatch: function (item) {
                                        var matchItem = bgsResource_1 &&
                                            bgsResource_1.find(function (bg) { return bg.hash === item.hash; });
                                        if (matchItem) {
                                            var hasFile = fs.pathExistsSync(matchItem.resultPath);
                                            return hasFile && matchItem;
                                        }
                                        return null;
                                    },
                                }, cacheDimension);
                                dimension = outputs.dimension, isRow = outputs.isRow, results = outputs.results, sliceArr = outputs.sliceArr;
                                imgHeight = dimension.height, imgWidth = dimension.width;
                                _imgWidth = imgWidth;
                                _imgHeight = imgHeight;
                                _isRow = isRow;
                                scale = bgSize ? bgSize / (isRow ? imgHeight : imgWidth) : 1;
                                _loop_1 = function (result) {
                                    var _a, info, index, hash, resultPath, url_2, left, top_1, width, height;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: return [4 /*yield*/, result];
                                            case 1:
                                                _a = _b.sent(), info = _a.info, index = _a.index, hash = _a.hash, resultPath = _a.resultPath, url_2 = _a.url;
                                                if (bgsResource_1.findIndex(function (br) { return br.hash === hash; }) === -1) {
                                                    bgsResource_1.push({
                                                        info: info,
                                                        url: url_2,
                                                        hash: hash,
                                                        index: index,
                                                        resultPath: resultPath,
                                                    });
                                                }
                                                left = info.left, top_1 = info.top, width = info.width, height = info.height;
                                                height *= scale;
                                                width *= scale;
                                                left *= scale;
                                                top_1 *= scale;
                                                bgs.push({
                                                    top: top_1,
                                                    left: left,
                                                    height: height,
                                                    width: width,
                                                    index: index,
                                                    url: url_2,
                                                    isRow: isRow,
                                                });
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _i = 0, results_1 = results;
                                _f.label = 6;
                            case 6:
                                if (!(_i < results_1.length)) return [3 /*break*/, 9];
                                result = results_1[_i];
                                return [5 /*yield**/, _loop_1(result)];
                            case 7:
                                _f.sent();
                                _f.label = 8;
                            case 8:
                                _i++;
                                return [3 /*break*/, 6];
                            case 9:
                                Object.assign(currentOption, {
                                    bgsResource: bgsResource_1,
                                    sliceArr: sliceArr,
                                    dimension: dimension,
                                });
                                return [3 /*break*/, 11];
                            case 10:
                                e_1 = _f.sent();
                                bgs = [
                                    {
                                        top: 0,
                                        left: 0,
                                        height: _imgHeight,
                                        width: _imgWidth,
                                        index: 0,
                                        url: url_1,
                                        isRow: _isRow,
                                    },
                                ];
                                console.error(e_1);
                                return [3 /*break*/, 11];
                            case 11:
                                cache[fileHash] = Object.assign(cache[fileHash] || {}, {
                                    options: Object.assign(((_b = cache[fileHash]) === null || _b === void 0 ? void 0 : _b.options) || {}, cacheOption),
                                    imgWidth: _imgWidth,
                                    imgHeight: _imgHeight,
                                });
                                localCss = template({
                                    bgs: bgs,
                                    isSep: isSep,
                                    selector: decl.parent.selector,
                                    bgWidth: _imgWidth * scale,
                                    bgHeight: _imgHeight * scale,
                                    imgWidth: _imgWidth,
                                    imgHeight: _imgHeight,
                                });
                                if (isSep) {
                                    decl.parent.after(localCss);
                                }
                                else {
                                    decl.after(localCss);
                                }
                                decl.remove();
                                _f.label = 12;
                            case 12: return [2 /*return*/];
                        }
                    });
                });
            },
        };
    };
    PostcssPlugin.postcss = true;
    return {
        PostcssPlugin: PostcssPlugin,
        cache: cache,
    };
});
