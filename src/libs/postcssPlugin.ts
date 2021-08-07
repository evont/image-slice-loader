import { PluginCreator } from "postcss";
import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs-extra";
import * as handlebars from "handlebars";
import { startsWith, useNumOnly, transformPX, transformAlias, getSlices } from "./util";
import { PluginOptions } from "../type";
import { ISizeCalculationResult } from "image-size/dist/types/interface";

export default ({ loaderContext, options }: PluginOptions) => {
  let { property, blockFormate, outputPath, clearOutput, template } = options;
  const PostcssPlugin: PluginCreator<{}> = function () {
    const reg = /url\(["']?(.*?)["']?\)/;

    const compilerOptions = loaderContext._compiler.options;
    const _alias = compilerOptions.resolve.alias;
    const _context = compilerOptions.context || loaderContext.rootContext;

    const alias = transformAlias(_alias);

    let realOutput = outputPath;
    // if output path is match alias, transform into alias path
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
    // if not alias or not absolute path, transform into path relate to webpack context
    if (!path.isAbsolute(realOutput)) {
      realOutput = path.resolve(_context, realOutput);
    }

    if (clearOutput) {
      try {
        fs.removeSync(realOutput);
      } catch (e) {
        void e;
      }
    }

    return {
      postcssPlugin: "image-slice-parser",
      async Declaration(decl) {
        if (decl.prop === property) {
          // use example: [url, bgWidth, slice, direction]
          // 1. long-bg: url(@assets/long-1.png) 375 300 column;
          // 2. long-bg: url(@assets/long-1.png) 375 [200, 400, 300];
          // TODO: consider more situation about wrong usage
          const formateVal = decl.value.replace(/(\d+,)\s?(?=\d)/g, "$1");
          const valArr = formateVal.split(" ");
          const url = reg.exec(valArr[0])?.[1] || "";
          let bgSize: number = useNumOnly(valArr[1]); // zero means use origin image size
          let slice: number[] = [300];
          if (valArr[2]) {
            slice = valArr[2]
              .split(",")
              .filter(Boolean)
              .map((num) => useNumOnly(num, 500));
          }
          const direction = valArr[3] || "column";
          const isRow = direction == "row";
          if (!url) return;

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
          const imgWidth = dimension.width;
          const imgHeight = dimension.height;
          const imgSize = isRow ? imgWidth : imgHeight;

          const sliceArr = getSlices(imgSize, slice);
          let offsetX = 0;
          let offsetY = 0;
          const scaleX = !isRow && bgSize ? bgSize / imgWidth : 1;
          const scaleY = isRow && bgSize ? bgSize / imgHeight : 1;
          const realWidth = imgWidth * (isRow ? scaleY : scaleX);
          const realHeight = imgHeight * (isRow ? scaleY : scaleX);
          let bgs = [];
          await new Promise<void>((resolve) => {
            const mtMap = new Map();

            sliceArr.forEach((slice, ind) => {
              const itemName = blockFormate(urlParse.name, ind);
              const itemBase = `${itemName}${fileExt}`;
              const resultPath = path.resolve(realOutput, itemBase);

              const extraWidth = isRow ? slice : imgWidth;
              const extraHeight = isRow ? imgHeight : slice;

              mtMap.set(ind, { offsetX, offsetY });
              sharp(filePath)
                .extract({
                  left: offsetX,
                  top: offsetY,
                  width: extraWidth,
                  height: extraHeight,
                })
                .toFile(resultPath, (err, info) => {
                  const offset = mtMap.get(ind);
                  let left = offset.offsetX;
                  let top = offset.offsetY;
                  let width = 0;
                  let height = 0;
                  if (isRow) {
                    width = slice;
                    height = imgHeight * scaleY;
                    width *= scaleY;
                    left *= scaleY;
                    top = "center"; // *= scaleY;
                  } else {
                    width = imgWidth * scaleX;
                    height = slice;
                    height *= scaleX;
                    left = "center"; // *= scaleX;
                    top *= scaleX;
                  }

                  bgs.push(
                    Object.assign(
                      transformPX({
                        top,
                        left,
                        height,
                        width,
                      }),
                      {
                        ind,
                        isLast: ind === sliceArr.length - 1,
                        url: path.join(outputPath, itemBase),
                      }
                    )
                  );
                  if (bgs.length === sliceArr.length) resolve();
                });
              offsetX += isRow ? extraWidth : 0;
              offsetY += isRow ? 0 : extraHeight;
            });
          });
          bgs.sort((a, b) => a.ind - b.ind);
          let templatePath = path.resolve(__dirname, "../../template.hbs");
          if (template) {
            if (path.isAbsolute(template)) {
              templatePath = template;
            } else {
              templatePath = path.resolve(_context, template);
            }
          }
          const _template = handlebars.compile(
            fs.readFileSync(templatePath, "utf-8")
          );
          const localCss = _template(
            Object.assign(
              { bgs },
              transformPX({
                imgWidth: realWidth,
                imgHeight: realHeight,
              })
            )
          );
          decl.after(localCss);
          decl.remove();
        }
      },
    };
  };
  PostcssPlugin.postcss = true;
  return PostcssPlugin;
};
