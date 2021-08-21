#!/usr/bin/env node
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var index_1 = require("./index");
var path = require("path");
var fs = require("fs-extra");
var util_1 = require("./core/util");
var program = new commander_1.Command();
program
    .option("-i, --image [type]", "image to be sliced")
    .option("-d, --direction [type]", "direction")
    .option("-s, --slice [numbers...]", "slice size")
    .option("-o, --output [type]", "output path for image")
    .option("-j, --json [type]", "image json file");
program.parse();
// console.log(program.opts());
function handlePath(p) {
    var isAbsolute = path.isAbsolute(p);
    if (!isAbsolute)
        p = path.resolve(process.cwd(), p);
    return p;
}
function formateOption(options) {
    return options.map(function (item) {
        var options = item.options, image = item.image;
        var slice = options.slice, _a = options.direction, direction = _a === void 0 ? 'column' : _a;
        return {
            image: image,
            options: {
                slice: __spreadArrays((Array.isArray(slice) ? slice : [slice])).map(function (s) { return Number.isNaN(+s) ? 0 : +s; }),
                direction: direction
            }
        };
    });
}
function exec(_a) {
    var _this = this;
    var image = _a.image, direction = _a.direction, slice = _a.slice, json = _a.json, output = _a.output;
    var options;
    if (json) {
        json = handlePath(json);
        var content = fs.readJsonSync(json);
        options = Array.isArray(content) ? content : [content];
    }
    else if (image) {
        image = handlePath(image);
        options = [{
                image: image,
                options: {
                    slice: slice,
                    direction: direction
                }
            }];
    }
    if (!options)
        throw new Error('Please pass a json path or a image path');
    options = formateOption(options);
    output = handlePath(output || "./slice");
    fs.ensureDirSync(output);
    index_1.sharps(options).forEach(function (result) {
        var dimension = result.dimension, image = result.image, tasks = result.tasks;
        var name = Buffer.isBuffer(image)
            ? util_1.getHash(image).substr(0, 7)
            : path.basename(image, path.extname(image));
        tasks.map(function (task, ind) { return __awaiter(_this, void 0, void 0, function () {
            var extra;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extra = task.extra;
                        return [4 /*yield*/, extra().toFile(path.resolve(output, name + "_" + (ind + 1) + "." + dimension.type))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
}
exec(program.opts());
