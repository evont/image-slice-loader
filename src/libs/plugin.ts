import { PluginCreator } from "postcss";
import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs-extra";
import * as handlebars from "handlebars";
import { createHash } from "crypto";
import {
  startsWith,
  useNumOnly,
  transformPX,
  transformAlias,
  getSlices,
  getOutput,
} from "./util";
import { PluginOptions } from "../type";
import { ISizeCalculationResult } from "image-size/dist/types/interface";
import { getImageCache } from "./cache";

function getBgHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return createHash("md5").update(buffer).digest("hex");
}

function getTemplate(template: string, context: string, fallback: string) {
  let templatePath;
  if (template) {
    if (path.isAbsolute(template)) {
      templatePath = template;
    } else {
      templatePath = path.resolve(context, template);
    }
  } else {
    templatePath = path.resolve(__dirname, fallback);
  }
  return templatePath;
}

export default ({ loaderContext, options }: PluginOptions) => {
  const cache = {};
  let {
    property,
    output,
    outputPath,
    template,
    sepTemplate,
    handlebarsHelpers,
  } = options;
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
      outputPath = path.resolve(_context, outputPath);
    }

    const hasAlreadyOutput = fs.pathExistsSync(realOutput);
    fs.ensureDirSync(realOutput);
    const oldCacheOption = {};
    return {
      postcssPlugin: "image-slice-parser",
      async Declaration(decl) {
        if (decl.prop === property) {
          // use example: [url, bgSize, slice, direction, isSep]
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
          let direction = "column";
          let isSep = false;
          let tmp = valArr[3];
          if (tmp === "column" || tmp === "row") {
            direction = tmp;
            if (valArr[4]) {
              tmp = valArr[4];
            } else {
              tmp = "";
            }
          }
          isSep = (tmp && tmp === "true") || false;
          const isRow = direction === "row";
          if (!url) return;

          const urlParse = path.parse(url);
          let filePath;
          try {
            filePath = await new Promise<string>((resolve, reject) =>
              loaderContext.resolve(loaderContext.context, url, (err, result) =>
                err ? reject(err) : resolve(result)
              )
            );
          } catch (err) {
            throw new Error(
              `${url} can't be loaded, Please use a correct file path`
            );
          }
          if (!filePath) return;

          const fileExt = path.extname(filePath);

          // TODO: update cache rule to match same file with different slice rule
          const fileHash = getBgHash(filePath);

          const optionHash = createHash("md5")
            .update(`${direction}${slice.join(",")}`, "utf-8")
            .digest("hex");

          let useCache = false;
          let bgsResource = [];
          let sliceArr = [];
          let imgWidth;
          let imgHeight;
          let oldCache = hasAlreadyOutput && getImageCache(fileHash, optionHash);
          const currentOption = {};
          let options = {};
          if (oldCache) {
            const {
              options: _options,
              imgWidth: _imgWidth,
              imgHeight: _imgHeight,
            } = oldCache;

            oldCacheOption[fileHash] = Object.assign(oldCacheOption[fileHash] || {}, {
              options: Object.assign(oldCacheOption[fileHash]?.options || {}, {
                [optionHash]: _options[optionHash]
              }),
            })
            options = oldCacheOption[fileHash].options;
            const { bgsResource: _bgsResource, sliceArr: _sliceArr } =
              options[optionHash];
            bgsResource = _bgsResource;
            sliceArr = _sliceArr;
            imgWidth = _imgWidth;
            imgHeight = _imgHeight;
            useCache = true;
          } else {
            options = {
              [optionHash]: currentOption,
            };
            const dimension = await new Promise<ISizeCalculationResult>(
              (resolve) => {
                sizeOf(filePath, (err, ds) => {
                  resolve(ds);
                });
              }
            );
            imgWidth = dimension.width;
            imgHeight = dimension.height;
          }

          cache[fileHash] = Object.assign(
            cache[fileHash] || {},
            {
              options: Object.assign(cache[fileHash]?.options || {}, options),
            },
            {
              imgWidth,
              imgHeight,
            }
          );

          const imgSize = isRow ? imgWidth : imgHeight;

          if (!sliceArr.length) sliceArr = getSlices(imgSize, slice);
          let offsetX = 0;
          let offsetY = 0;
          const scaleX = !isRow && bgSize ? bgSize / imgWidth : 1;
          const scaleY = isRow && bgSize ? bgSize / imgHeight : 1;
          const realWidth = imgWidth * (isRow ? scaleY : scaleX);
          const realHeight = imgHeight * (isRow ? scaleY : scaleX);
          let bgs = [];
          const mtMap = new Map();
          const tasks = sliceArr.map((slice, ind) => {
            const itemName = getOutput(output, urlParse.name, ind, optionHash.substr(0, 5));
            const itemBase = `${itemName}${fileExt}`;
            const resultPath = path.resolve(realOutput, itemBase);

            const extraWidth = isRow ? slice : imgWidth;
            const extraHeight = isRow ? imgHeight : slice;
            const url = path.join(outputPath, itemBase);
            mtMap.set(ind, { offsetX, offsetY });

            let prm;
            const hasFile = fs.pathExistsSync(resultPath) && bgsResource.find(bg => bg.ind === ind)?.filePath === resultPath;
            if (useCache && hasFile) {
              prm = Promise.resolve();
              // console.log("use cache to prm");
            } else {
              if (!useCache) {
                bgsResource.push({
                  ind,
                  url,
                  offsetX,
                  offsetY,
                  filePath: resultPath
                });
              }
              
              prm = sharp(filePath)
                .extract({
                  left: offsetX,
                  top: offsetY,
                  width: extraWidth,
                  height: extraHeight,
                })
                .toFile(resultPath);
            }

            const task = prm.then(() => {
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
              return Object.assign(
                transformPX({
                  top,
                  left,
                  height,
                  width,
                }),
                {
                  ind,
                  isLast: ind === sliceArr.length - 1,
                  url,
                  offsetX,
                  offsetY,
                }
              );
            });

            offsetX += isRow ? extraWidth : 0;
            offsetY += isRow ? 0 : extraHeight;
            return task;
          });
          // only if all images is extracted should we continue to process css file
          // error will fallback to use original image
          try {
            bgs = await Promise.all(tasks);
            // file is NOT generate in sequence, mark index & sort it after all file is generated
            bgs.sort((a, b) => a.ind - b.ind);
            // cache[filePath].bgs = bgsResource;
            Object.assign(currentOption, {
              bgsResource,
              sliceArr,
            });
          } catch (err) {
            bgs = [
              {
                isLast: true,
                ind: 0,
                url,
                // TODO: what would be the better way to define the top & left
                ...transformPX({
                  top: isRow ? "center" : "top",
                  left: isRow ? "left" : "center",
                  height: isRow ? bgSize : imgHeight * scaleX,
                  width: isRow ? imgWidth * scaleY : bgSize,
                }),
              },
            ];
            console.error(err);
          }
          const templatePath = isSep
            ? getTemplate(sepTemplate, _context, "../../template-sep.hbs")
            : getTemplate(template, _context, "../../template.hbs");
          if (handlebarsHelpers) {
            handlebars.registerHelper(handlebarsHelpers);
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
          if (isSep) {
            decl.parent.after(localCss);
          } else {
            decl.after(localCss);
          }

          decl.remove();
        }
      },
    };
  };
  PostcssPlugin.postcss = true;
  return {
    PostcssPlugin,
    cache,
  };
};
