import { getOptions } from 'loader-utils';
import postcss from "postcss";

import postcssPlugin from "./libs/postcssPlugin";
import { LoaderOptions } from './type';

// TODO: 
// 1. 截断长度为数字时，按数字截断，长度为数组时，判断数据是不是纯数字，然后按顺序截断

// 2. 考虑构建缓存，尽量只在url 变化的时候做变化

// 3. 测试删除原来图片的功能

// 4. 考虑横竖方向裁剪

// 5，考虑能不能除了css 中使用，也做成html 中使用长背景懒加载
// css 的loader 滚动加载方案可以考虑用滚动时动态加类名的形式
// 也可以考虑如果是模版之类的情况下，使用指定的选择器拿到长图属性，输出img 到指定的选择器


//TODO: 做参数验证
function mergeOptions(options: LoaderOptions): LoaderOptions {
  return Object.assign({
    slice: 200,
    property: "long-bg",
    name: "[name]-[contenthash].[ext]",
    blockFormate: (name, index) => {
      return `${name}__block__${index}`;
    },
    clearOutput: true,
    outputPath: "./slice"
  }, options)
}
export default function loader(source, meta) {
  const callback = this.async();
  this.cacheable();
  const options = mergeOptions(getOptions(this) || {});
  const pcOptions = {
    to: this.resourcePath,
    from: this.resourcePath,
  };
  
  postcss(postcssPlugin({ loaderContext: this, options })).process(source, pcOptions).then(result => {
    const map = result.map && result.map.toJSON();
    callback(null, result.css, map);
    return null;
  }).catch((error) => {
    callback(error);
  });
}