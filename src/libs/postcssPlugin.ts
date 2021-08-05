import { PluginCreator } from "postcss";
import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs-extra";
import { PluginOptions } from "../type";
import { ISizeCalculationResult } from "image-size/dist/types/interface";

// enhanced-resolve/lib/AliasPlugin
function startsWith(string, searchString) {
  const stringLength = string.length;
  const searchLength = searchString.length;

  // early out if the search length is greater than the search string
  if (searchLength > stringLength) {
    return false;
  }
  let index = -1;
  while (++index < searchLength) {
    if (string.charCodeAt(index) !== searchString.charCodeAt(index)) {
      return false;
    }
  }
  return true;
}

export default ({ loaderContext, options }: PluginOptions) => {
  let { property, slice, blockFormate, name, outputPath, clearOutput } = options;
  const PostcssPlugin: PluginCreator<{}> = function () {
    const reg = /url\(["']?(.*?)["']?\)\s*(?:(\d+)(?:px)?)?/;

    const compilerOptions = loaderContext._compiler.options;
    const _alias = compilerOptions.resolve.alias;
    const alias = Object.keys(_alias).map((key) => {
      let obj = _alias[key];
      let onlyModule = false;
      if (/\$$/.test(key)) {
        onlyModule = true;
        key = key.substr(0, key.length - 1);
      }
      if (typeof obj === "string") {
        obj = {
          alias: obj,
        };
      }
      obj = Object.assign(
        {
          name: key,
          onlyModule,
        },
        obj
      );
      return obj;
    });

    let realOutput = outputPath;
    for (const item of alias) {
      if (
        outputPath === item.name ||
        (!item.onlyModule && startsWith(outputPath, item.name + "/"))
      ) {
        if (
          outputPath !== item.alias &&
          !startsWith(outputPath, `${item.alias}/`)
        ) {
          realOutput = item.alias + outputPath.substr(item.name.length);
        }
      }
    }
    if (clearOutput) {
      try {
        fs.removeSync(realOutput)
      } catch(e) {
        void e;
      }
    }

    return {
      postcssPlugin: "image-slice-parser",
      async Declaration(decl) {
        if (decl.prop === property) {
          const cap = reg.exec(decl.value);
          const bgWidth: number = +(cap[2] || 0);
          const url = cap[1];
          const urlParse = path.parse(url);
          let filePath;

          
          await fs.ensureDir(realOutput);

          try {
            filePath = await new Promise<string>((resolve, reject) =>
              loaderContext.resolve(loaderContext.context, url, (err, result) =>
                err ? reject(err) : resolve(result)
              )
            );
          } catch (err) {
            // TODO: update error handler
            console.error("url invalid");
          }
          if (!filePath) return;

          const fileExt = path.extname(filePath);
          const dimension = await new Promise<ISizeCalculationResult>(
            (resolve) => {
              sizeOf(filePath, (err, ds) => {
                resolve(ds);
              });
            }
          );
          const heights = [];
          let imgHeight = dimension.height;
          let imgWidth = dimension.width;
          while (imgHeight > 0) {
            if (imgHeight > slice) {
              heights.push(slice);
              imgHeight -= slice;
            } else {
              heights.push(imgHeight);
              imgHeight = 0;
            }
          }
          let marginTop = 0;
          const bgs = [];
          await new Promise<void>((resolve) => {
            const mtMap = new Map();
            heights.forEach((height, ind) => {
              const itemName = blockFormate(urlParse.name, ind);
              const itemBase = `${itemName}${fileExt}`;
              const resultPath = path.resolve(realOutput, itemBase);
              mtMap.set(ind, marginTop);
              sharp(filePath)
                .extract({
                  left: 0,
                  top: marginTop,
                  width: imgWidth,
                  height,
                })
                .toFile(resultPath, (err, info) => {
                  let _bgWidth = imgWidth;
                  let _bgHeight = height;
                  let _top = mtMap.get(ind);
                  if (bgWidth) {
                    const scaleFactor = bgWidth / imgWidth;
                    _bgWidth = bgWidth;
                    _bgHeight = height * scaleFactor;
                    _top = _top * scaleFactor;
                  }
                  bgs.push({
                    top: _top,
                    height: _bgHeight,
                    width: _bgWidth,
                    ind,
                    url: path.join(outputPath, itemBase),
                  });
                  if (bgs.length === heights.length) resolve();
                });
              marginTop += height;
            });
          });
          const temp = bgs
            .sort((a, b) => a.ind - b.ind)
            .map((bg) => {
              const { height, width, top, url } = bg;
              return `no-repeat center ${top}px/${width}px ${height}px url("${url}")`;
            })
            .join(",");
          decl.replaceWith({
            prop: "background",
            value: temp,
          });
        }
      },
    };
  };
  PostcssPlugin.postcss = true;
  return PostcssPlugin;
};
