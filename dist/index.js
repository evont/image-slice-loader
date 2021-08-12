"use strict";
exports.__esModule = true;
var loader_utils_1 = require("loader-utils");
var postcss_1 = require("postcss");
var schema_utils_1 = require("schema-utils");
var plugin_1 = require("./libs/plugin");
var constant_1 = require("./libs/constant");
var cache_1 = require("./libs/cache");
var schema_1 = require("./schema");
// TODO:
// 1. 选项变化时构建需重来
//TODO: 做参数验证
function mergeOptions(options) {
    var mergeOption = Object.assign({
        property: "long-bg",
        outputPath: "./slice",
        output: "[hash]_[index]"
    }, options);
    schema_utils_1.validate(schema_1["default"], mergeOption, {
        name: constant_1.LOADER_NAME
    });
    return mergeOption;
}
function loader(source, meta) {
    var callback = this.async();
    this.cacheable();
    var options = {};
    try {
        options = mergeOptions(loader_utils_1.getOptions(this) || {});
        var pcOptions = {
            to: this.resourcePath,
            from: this.resourcePath
        };
        var _a = plugin_1["default"]({
            loaderContext: this,
            options: options
        }), cache_2 = _a.cache, PostcssPlugin = _a.PostcssPlugin;
        postcss_1["default"](PostcssPlugin)
            .process(source, pcOptions)
            .then(function (result) {
            var map = result.map && result.map.toJSON();
            // console.log(cache);
            cache_1.invalidCache(cache_2);
            cache_1.setCache(cache_2);
            callback(null, result.css, map);
        })["catch"](function (error) {
            callback(error);
        });
    }
    catch (error) {
        callback(error);
    }
}
exports["default"] = loader;
