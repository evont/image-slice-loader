import meta from "./meta";
import { asyncHooks } from "./util/pluginHooks";
import { WebpackPluginInstance } from "webpack";

export default class ImageSlicePlugin implements WebpackPluginInstance {
  constructor(options) {
    this.options = options;
  }
  PLUGIN_NAME = meta.PLUGIN_NAME;
  options = {};
  apply(compiler) {
    const pluginName = meta.PLUGIN_NAME;
    const { NormalModule } = compiler.webpack;
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const { loader: normalModuleHook } =
        NormalModule.getCompilationHooks(compilation);
      normalModuleHook.tap(pluginName, (loaderContext) => {
        loaderContext[pluginName] = this;
      });
    });
  }
  //   plugin(obj, name, callback) {
  //     if (obj.hooks) {
  //         if (asyncHooks.includes(name))
  //             obj.hooks[name].tapAsync(this.PLUGIN_NAME, callback);
  //         else
  //             obj.hooks[name].tap(this.PLUGIN_NAME, callback);
  //     } else {
  //         name = name.replace(/([A-Z])/g, (m, $1) => '-' + $1.toLowerCase());
  //         obj.plugin(name, callback);
  //     }
  // }
}
