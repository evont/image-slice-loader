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
exports.__esModule = true;
var image_size_1 = require("image-size");
var sharp = require("sharp");
var path = require("path");
var fs = require("fs-extra");
var handlebars = require("handlebars");
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
exports["default"] = (function (_a) {
    var loaderContext = _a.loaderContext, options = _a.options;
    var property = options.property, slice = options.slice, blockFormate = options.blockFormate, name = options.name, outputPath = options.outputPath, clearOutput = options.clearOutput, template = options.template;
    var PostcssPlugin = function () {
        var reg = /url\(["']?(.*?)["']?\)\s*(?:(\d+)(?:px)?)?/;
        var compilerOptions = loaderContext._compiler.options;
        var _alias = compilerOptions.resolve.alias;
        var _context = compilerOptions.context || loaderContext.rootContext;
        var alias = Object.keys(_alias).map(function (key) {
            var obj = _alias[key];
            var onlyModule = false;
            if (/\$$/.test(key)) {
                onlyModule = true;
                key = key.substr(0, key.length - 1);
            }
            if (typeof obj === "string") {
                obj = {
                    alias: obj
                };
            }
            obj = Object.assign({
                name: key,
                onlyModule: onlyModule
            }, obj);
            return obj;
        });
        var realOutput = outputPath;
        // if output path is match alias, transform into alias path
        for (var _i = 0, alias_1 = alias; _i < alias_1.length; _i++) {
            var item = alias_1[_i];
            if (outputPath === item.name ||
                (!item.onlyModule && startsWith(outputPath, item.name + "/"))) {
                if (outputPath !== item.alias &&
                    !startsWith(outputPath, item.alias + "/")) {
                    realOutput = item.alias + outputPath.substr(item.name.length);
                }
            }
        }
        // if not alias or not absolute path, transform into path relate to webpack context
        if (!path.isAbsolute(realOutput)) {
            realOutput = path.resolve(_context, realOutput);
        }
        if (clearOutput) {
            try {
                fs.removeSync(realOutput);
            }
            catch (e) {
                void e;
            }
        }
        return {
            postcssPlugin: "image-slice-parser",
            Declaration: function (decl) {
                return __awaiter(this, void 0, void 0, function () {
                    var cap, bgWidth_1, url_1, urlParse_1, filePath_1, err_1, fileExt_1, dimension, heights_1, imgHeight, imgWidth_1, marginTop_1, bgs_1, templatePath, _template, localCss;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(decl.prop === property)) return [3 /*break*/, 8];
                                cap = reg.exec(decl.value);
                                bgWidth_1 = +(cap[2] || 0);
                                url_1 = cap[1];
                                urlParse_1 = path.parse(url_1);
                                return [4 /*yield*/, fs.ensureDir(realOutput)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        return loaderContext.resolve(loaderContext.context, url_1, function (err, result) {
                                            return err ? reject(err) : resolve(result);
                                        });
                                    })];
                            case 3:
                                filePath_1 = _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                err_1 = _a.sent();
                                // TODO: update error handler
                                console.error("url invalid");
                                return [3 /*break*/, 5];
                            case 5:
                                if (!filePath_1)
                                    return [2 /*return*/];
                                fileExt_1 = path.extname(filePath_1);
                                return [4 /*yield*/, new Promise(function (resolve) {
                                        image_size_1["default"](filePath_1, function (err, ds) {
                                            resolve(ds);
                                        });
                                    })];
                            case 6:
                                dimension = _a.sent();
                                heights_1 = [];
                                imgHeight = dimension.height;
                                imgWidth_1 = dimension.width;
                                while (imgHeight > 0) {
                                    if (imgHeight > slice) {
                                        heights_1.push(slice);
                                        imgHeight -= slice;
                                    }
                                    else {
                                        heights_1.push(imgHeight);
                                        imgHeight = 0;
                                    }
                                }
                                marginTop_1 = 0;
                                bgs_1 = [];
                                return [4 /*yield*/, new Promise(function (resolve) {
                                        var mtMap = new Map();
                                        heights_1.forEach(function (height, ind) {
                                            var itemName = blockFormate(urlParse_1.name, ind);
                                            var itemBase = "" + itemName + fileExt_1;
                                            var resultPath = path.resolve(realOutput, itemBase);
                                            mtMap.set(ind, marginTop_1);
                                            sharp(filePath_1)
                                                .extract({
                                                left: 0,
                                                top: marginTop_1,
                                                width: imgWidth_1,
                                                height: height
                                            })
                                                .toFile(resultPath, function (err, info) {
                                                var _bgWidth = imgWidth_1;
                                                var _bgHeight = height;
                                                var _top = mtMap.get(ind);
                                                if (bgWidth_1) {
                                                    var scaleFactor = bgWidth_1 / imgWidth_1;
                                                    _bgWidth = bgWidth_1;
                                                    _bgHeight = height * scaleFactor;
                                                    _top = _top * scaleFactor;
                                                }
                                                bgs_1.push({
                                                    top: _top,
                                                    height: _bgHeight,
                                                    width: _bgWidth,
                                                    ind: ind,
                                                    isLast: ind === heights_1.length - 1,
                                                    url: path.join(outputPath, itemBase)
                                                });
                                                if (bgs_1.length === heights_1.length)
                                                    resolve();
                                            });
                                            marginTop_1 += height;
                                        });
                                    })];
                            case 7:
                                _a.sent();
                                bgs_1.sort(function (a, b) { return a.ind - b.ind; });
                                templatePath = path.resolve(__dirname, "../../template.hbs");
                                if (template) {
                                    if (path.isAbsolute(template)) {
                                        templatePath = template;
                                    }
                                    else {
                                        templatePath = path.resolve(_context, template);
                                    }
                                }
                                _template = handlebars.compile(fs.readFileSync(templatePath, 'utf-8'));
                                localCss = _template({ bgs: bgs_1 });
                                decl.after(localCss);
                                decl.remove();
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            }
        };
    };
    PostcssPlugin.postcss = true;
    return PostcssPlugin;
});
