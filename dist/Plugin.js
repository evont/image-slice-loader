"use strict";
exports.__esModule = true;
var meta_1 = require("./meta");
var ImageSlicePlugin = /** @class */ (function () {
    function ImageSlicePlugin(options) {
        this.PLUGIN_NAME = meta_1["default"].PLUGIN_NAME;
        this.options = {};
        this.options = options;
    }
    ImageSlicePlugin.prototype.apply = function (compiler) {
        var _this = this;
        var pluginName = meta_1["default"].PLUGIN_NAME;
        var NormalModule = compiler.webpack.NormalModule;
        compiler.hooks.compilation.tap(pluginName, function (compilation) {
            var normalModuleHook = NormalModule.getCompilationHooks(compilation).loader;
            normalModuleHook.tap(pluginName, function (loaderContext) {
                loaderContext[pluginName] = _this;
            });
        });
    };
    return ImageSlicePlugin;
}());
exports["default"] = ImageSlicePlugin;
