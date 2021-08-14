"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
var image_size_1 = require("image-size");
var sharp = require("sharp");
var path = require("path");
var fs = require("fs-extra");
var util_1 = require("../core/util");
var util_2 = require("./util");
var cache_1 = require("./util/cache");
exports["default"] = (function (_a) {
    var loaderContext = _a.loaderContext, options = _a.options;
    var cache = {};
    var property = options.property, output = options.output, outputPath = options.outputPath, template = options.template;
    var PostcssPlugin = function () {
        var reg = /url\(["']?(.*?)["']?\)/;
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
        var hasAlreadyOutput = fs.pathExistsSync(realOutput);
        fs.ensureDirSync(realOutput);
        var oldCacheOption = {};
        return {
            postcssPlugin: "image-slice-parser",
            Declaration: function (decl) {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function () {
                    var formateVal, valArr, url_1, bgSize, slice, direction, isSep, tmp, isRow_1, urlParse_1, filePath_1, err_1, fileExt_1, fileHash, optionHash_1, useCache_1, bgsResource_1, sliceArr_1, imgWidth_1, imgHeight_1, oldCache, currentOption, options_1, _options, _imgWidth, _imgHeight, _d, _bgsResource, _sliceArr, dimension, imgSize, offsetX_1, offsetY_1, scaleX_1, scaleY_1, realWidth, realHeight, bgs, mtMap_1, tasks, err_2, localCss;
                    var _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                if (!(decl.prop === property)) return [3 /*break*/, 12];
                                formateVal = decl.value.replace(/(\d+,)\s?(?=\d)/g, "$1");
                                valArr = formateVal.split(" ");
                                url_1 = ((_a = reg.exec(valArr[0])) === null || _a === void 0 ? void 0 : _a[1]) || "";
                                bgSize = util_1.useNumOnly(valArr[1]);
                                slice = [300];
                                if (valArr[2]) {
                                    slice = valArr[2]
                                        .split(",")
                                        .filter(Boolean)
                                        .map(function (num) { return util_1.useNumOnly(num, 500); });
                                }
                                direction = "column";
                                isSep = false;
                                tmp = valArr[3];
                                if (tmp === "column" || tmp === "row") {
                                    direction = tmp;
                                    if (valArr[4]) {
                                        tmp = valArr[4];
                                    }
                                    else {
                                        tmp = "";
                                    }
                                }
                                isSep = (tmp && tmp === "true") || false;
                                isRow_1 = direction === "row";
                                if (!url_1)
                                    return [2 /*return*/];
                                urlParse_1 = path.parse(url_1);
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        return loaderContext.resolve(loaderContext.context, url_1, function (err, result) {
                                            return err ? reject(err) : resolve(result);
                                        });
                                    })];
                            case 2:
                                filePath_1 = _g.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _g.sent();
                                throw new Error(url_1 + " can't be loaded, Please use a correct file path");
                            case 4:
                                if (!filePath_1)
                                    return [2 /*return*/];
                                fileExt_1 = path.extname(filePath_1);
                                fileHash = util_1.getHash(fs.readFileSync(filePath_1));
                                optionHash_1 = util_1.getHash("" + direction + slice.join(","));
                                useCache_1 = false;
                                bgsResource_1 = [];
                                sliceArr_1 = [];
                                oldCache = hasAlreadyOutput && cache_1.getImageCache(fileHash, optionHash_1);
                                currentOption = {};
                                options_1 = {};
                                if (!oldCache) return [3 /*break*/, 5];
                                _options = oldCache.options, _imgWidth = oldCache.imgWidth, _imgHeight = oldCache.imgHeight;
                                oldCacheOption[fileHash] = Object.assign(oldCacheOption[fileHash] || {}, {
                                    options: Object.assign(((_b = oldCacheOption[fileHash]) === null || _b === void 0 ? void 0 : _b.options) || {}, (_e = {},
                                        _e[optionHash_1] = _options[optionHash_1],
                                        _e))
                                });
                                options_1 = oldCacheOption[fileHash].options;
                                _d = options_1[optionHash_1], _bgsResource = _d.bgsResource, _sliceArr = _d.sliceArr;
                                bgsResource_1 = _bgsResource;
                                sliceArr_1 = _sliceArr;
                                imgWidth_1 = _imgWidth;
                                imgHeight_1 = _imgHeight;
                                useCache_1 = true;
                                return [3 /*break*/, 7];
                            case 5:
                                options_1 = (_f = {},
                                    _f[optionHash_1] = currentOption,
                                    _f);
                                return [4 /*yield*/, new Promise(function (resolve) {
                                        image_size_1["default"](filePath_1, function (err, ds) {
                                            resolve(ds);
                                        });
                                    })];
                            case 6:
                                dimension = _g.sent();
                                imgWidth_1 = dimension.width;
                                imgHeight_1 = dimension.height;
                                _g.label = 7;
                            case 7:
                                cache[fileHash] = Object.assign(cache[fileHash] || {}, {
                                    options: Object.assign(((_c = cache[fileHash]) === null || _c === void 0 ? void 0 : _c.options) || {}, options_1)
                                }, {
                                    imgWidth: imgWidth_1,
                                    imgHeight: imgHeight_1
                                });
                                imgSize = isRow_1 ? imgWidth_1 : imgHeight_1;
                                if (!sliceArr_1.length)
                                    sliceArr_1 = util_1.getSlices(imgSize, slice);
                                offsetX_1 = 0;
                                offsetY_1 = 0;
                                scaleX_1 = !isRow_1 && bgSize ? bgSize / imgWidth_1 : 1;
                                scaleY_1 = isRow_1 && bgSize ? bgSize / imgHeight_1 : 1;
                                realWidth = imgWidth_1 * (isRow_1 ? scaleY_1 : scaleX_1);
                                realHeight = imgHeight_1 * (isRow_1 ? scaleY_1 : scaleX_1);
                                bgs = [];
                                mtMap_1 = new Map();
                                tasks = sliceArr_1.map(function (slice, ind) {
                                    var _a;
                                    var itemName = util_1.getOutput(output, urlParse_1.name, ind, optionHash_1.substr(0, 5));
                                    var itemBase = "" + itemName + fileExt_1;
                                    var resultPath = path.resolve(realOutput, itemBase);
                                    var extraWidth = isRow_1 ? slice : imgWidth_1;
                                    var extraHeight = isRow_1 ? imgHeight_1 : slice;
                                    var url = path.join(outputPath, itemBase);
                                    mtMap_1.set(ind, { offsetX: offsetX_1, offsetY: offsetY_1 });
                                    var prm;
                                    var hasFile = fs.pathExistsSync(resultPath) &&
                                        ((_a = bgsResource_1.find(function (bg) { return bg.ind === ind; })) === null || _a === void 0 ? void 0 : _a.filePath) === resultPath;
                                    if (useCache_1 && hasFile) {
                                        prm = Promise.resolve();
                                        // console.log("use cache to prm");
                                    }
                                    else {
                                        if (!useCache_1) {
                                            bgsResource_1.push({
                                                ind: ind,
                                                url: url,
                                                offsetX: offsetX_1,
                                                offsetY: offsetY_1,
                                                filePath: resultPath
                                            });
                                        }
                                        prm = sharp(filePath_1)
                                            .extract({
                                            left: offsetX_1,
                                            top: offsetY_1,
                                            width: extraWidth,
                                            height: extraHeight
                                        })
                                            .toFile(resultPath);
                                    }
                                    var task = prm.then(function () {
                                        var offset = mtMap_1.get(ind);
                                        var left = offset.offsetX;
                                        var top = offset.offsetY;
                                        var width = 0;
                                        var height = 0;
                                        if (isRow_1) {
                                            width = slice;
                                            height = imgHeight_1 * scaleY_1;
                                            width *= scaleY_1;
                                            left *= scaleY_1;
                                            top = "center"; // *= scaleY;
                                        }
                                        else {
                                            width = imgWidth_1 * scaleX_1;
                                            height = slice;
                                            height *= scaleX_1;
                                            left = "center"; // *= scaleX;
                                            top *= scaleX_1;
                                        }
                                        return Object.assign(util_1.transformPX({
                                            top: top,
                                            left: left,
                                            height: height,
                                            width: width
                                        }), {
                                            ind: ind,
                                            isLast: ind === sliceArr_1.length - 1,
                                            url: url,
                                            offsetX: offsetX_1,
                                            offsetY: offsetY_1
                                        });
                                    });
                                    offsetX_1 += isRow_1 ? extraWidth : 0;
                                    offsetY_1 += isRow_1 ? 0 : extraHeight;
                                    return task;
                                });
                                _g.label = 8;
                            case 8:
                                _g.trys.push([8, 10, , 11]);
                                return [4 /*yield*/, Promise.all(tasks)];
                            case 9:
                                bgs = _g.sent();
                                // file is NOT generate in sequence, mark index & sort it after all file is generated
                                bgs.sort(function (a, b) { return a.ind - b.ind; });
                                // cache[filePath].bgs = bgsResource;
                                Object.assign(currentOption, {
                                    bgsResource: bgsResource_1,
                                    sliceArr: sliceArr_1
                                });
                                return [3 /*break*/, 11];
                            case 10:
                                err_2 = _g.sent();
                                bgs = [
                                    __assign({ isLast: true, ind: 0, url: url_1 }, util_1.transformPX({
                                        top: isRow_1 ? "center" : "top",
                                        left: isRow_1 ? "left" : "center",
                                        height: isRow_1 ? bgSize : imgHeight_1 * scaleX_1,
                                        width: isRow_1 ? imgWidth_1 * scaleY_1 : bgSize
                                    })),
                                ];
                                console.error(err_2);
                                return [3 /*break*/, 11];
                            case 11:
                                localCss = template(Object.assign({ bgs: bgs }, util_1.transformPX({
                                    imgWidth: realWidth,
                                    imgHeight: realHeight
                                })));
                                if (isSep) {
                                    decl.parent.after(localCss);
                                }
                                else {
                                    decl.after(localCss);
                                }
                                decl.remove();
                                _g.label = 12;
                            case 12: return [2 /*return*/];
                        }
                    });
                });
            }
        };
    };
    PostcssPlugin.postcss = true;
    return {
        PostcssPlugin: PostcssPlugin,
        cache: cache
    };
});
