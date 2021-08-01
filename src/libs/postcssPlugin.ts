import { PluginCreator } from "postcss";
import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import { interpolateName } from "loader-utils";

import { PluginOptions } from "../type";
import { ISizeCalculationResult } from "image-size/dist/types/interface";

export default ({ loaderContext, options }: PluginOptions) => {
  let { property, slice, blockFormate, name, outputPath } = options;
  const PostcssPlugin: PluginCreator<{}> = function () {
    const reg = /url\(["']?(.*?)["']?\)\s*(?:(\d+)(?:px)?)?/;
    return {
      postcssPlugin: "image-slice-parser",
      async Declaration(decl) {
        if (decl.prop === property) {
          const cap = reg.exec(decl.value);
          const bgWidth: number = +(cap[2] || 0);
          const url = cap[1];
          const urlParse = path.parse(url);
          const filePath = await new Promise<string>((resolve, reject) =>
            loaderContext.resolve(loaderContext.context, url, (err, result) =>
              err ? reject(err) : resolve(result)
            )
          );
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
              const itemBase = `${itemName}${urlParse.ext}`;
              const urlPath = path.format(
                Object.assign({}, urlParse, {
                  dir: path.posix.join(urlParse.dir, "slice"),
                  name: itemName,
                  base: itemBase,
                })
              );
              const resultPath = path.resolve(
                path.posix.join(path.parse(filePath).dir, "slice"),
                itemBase
              );
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
                    url: urlPath,
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
