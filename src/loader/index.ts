import { getOptions } from "loader-utils";
import postcss from "postcss";
import { validate } from "schema-utils";

import getPlugin from "./plugin";
import { LOADER_NAME } from "./util/constant";
import { invalidCache, setCache, setCachePath } from "./util/cache";
import { LoaderOptions } from "../type";
import schema from "./schema";

function mergeOptions(options: LoaderOptions): LoaderOptions {
  const mergeOption = Object.assign(
    {
      property: "long-bg",
      outputPath: "./slice",
      output: "[hash]_[index]"
    },
    options
  );
  validate(schema, mergeOption, {
    name: LOADER_NAME,
  });
  return mergeOption;
}
export default function loader(source) {
  const callback = this.async();
  this.cacheable();
  let options: LoaderOptions = {};
  try {
    options = mergeOptions(getOptions(this) || {});
    if (options.cachePath) {
      setCachePath(options.cachePath)
    }
    const pcOptions = {
      to: this.resourcePath,
      from: this.resourcePath,
    };

    const { cache, PostcssPlugin } = getPlugin({
      loaderContext: this,
      options,
    });
    postcss(PostcssPlugin)
      .process(source, pcOptions)
      .then((result) => {
        const map = result.map && result.map.toJSON();
        // console.log(cache);
        invalidCache(cache);
        
        setCache(cache);
        callback(null, result.css, map);
      })
      .catch((error) => {
        callback(error);
      });
  } catch (error) {
    callback(error);
  }
}
