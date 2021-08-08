import { getOptions } from "loader-utils";
import postcss from "postcss";
import { validate } from "schema-utils";

import getPlugin from "./libs/plugin";
import { LOADER_NAME } from "./libs/constant";
import { getCache, setCache, invalidCache } from "./libs/cache";
import { LoaderOptions } from "./type";
import schema from "./schema";

// TODO:
// 1. 缓存策略优化
// 2. 考虑构建缓存，尽量只在url 变化的时候做变化

//TODO: 做参数验证
function mergeOptions(options: LoaderOptions): LoaderOptions {
  const mergeOption = Object.assign(
    {
      property: "long-bg",
      clearOutput: true,
      outputPath: "./slice",
    },
    options
  );
  validate(schema, mergeOption, {
    name: LOADER_NAME,
  });
  return mergeOption;
}
export default function loader(source, meta) {
  const callback = this.async();
  this.cacheable();
  let options = {};
  try {
    options = mergeOptions(getOptions(this) || {});
    const pcOptions = {
      to: this.resourcePath,
      from: this.resourcePath,
    };
    const oldCache = getCache();

    const { cache, PostcssPlugin } = getPlugin({
      loaderContext: this,
      options,
      oldCache,
    });
    postcss(PostcssPlugin)
      .process(source, pcOptions)
      .then((result) => {
        const map = result.map && result.map.toJSON();
        // console.log(cache);
        invalidCache(cache, oldCache);

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
