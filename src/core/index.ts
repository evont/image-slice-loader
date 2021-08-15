import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs-extra";
import {
  ShareOutput,
  SharpOption,
  SharpParam,
  SharpPicOption,
  SharpReturn,
  SharpTask,
  ShareResult,
} from "../type";
import { getSlices, getHash, getOutput } from "./util";

function sharpPic(
  image: Buffer | string,
  options: SharpPicOption
): SharpReturn {
  let { direction, slice } = options;
  if (typeof slice === "number") slice = [slice];

  const isRow = direction === "row";
  try {
    const dimension = sizeOf(image);
    const { width: imgWidth, height: imgHeight } = dimension;

    const imgSize = isRow ? imgWidth : imgHeight;
    const sliceArr = getSlices(imgSize, slice);
    // console.log(sliceArr);
    let offsetX = 0;
    let offsetY = 0;
    return {
      dimension,
      image,
      isRow,
      sliceArr,
      tasks: sliceArr.map((slice, ind) => {
        const width = isRow ? slice : imgWidth;
        const height = isRow ? imgHeight : slice;
        const left = offsetX;
        const top = offsetY;

        offsetX += isRow ? width : 0;
        offsetY += isRow ? 0 : height;
        const info = {
          left,
          top,
          width,
          height,
        };
        const hash = getHash([ind, left, top, width, height].join("-"));
        // const extra = sharp(image).extract(info);
        // const { data } = await extra.toBuffer({ resolveWithObject: true });
        // const hash = getHash(data);
        return {
          info,
          slice,
          extra: () => sharp(image).extract(info),
          hash,
        };
      }),
    };
  } catch (e) {
    throw e;
  }
}

export function sharps(images: SharpParam[]) {
  return images
    .map(({ image, options }) => sharpPic(image, options))
    .filter(Boolean);
}
type OutputSharpOption = SharpOption & {
  urlPath?: string;
  cacheMatch?: (task: Partial<SharpTask>) => ShareResult | null;
};
export function outputSharp(
  images: SharpParam,
  options: OutputSharpOption
): ShareOutput;
export function outputSharp(
  images: SharpParam[],
  options: OutputSharpOption
): ShareOutput[];

export function outputSharp(
  images: SharpParam | SharpParam[],
  options: OutputSharpOption
): ShareOutput | ShareOutput[] {
  const { outputPath, output, urlPath, cacheMatch } = options;
  fs.ensureDirSync(outputPath);
  function deal(sharpsTask: SharpReturn): ShareOutput {
    const { dimension, tasks, image, sliceArr, isRow } = sharpsTask;
    const name = Buffer.isBuffer(image)
      ? getHash(image).substr(0, 7)
      : path.basename(image, path.extname(image));
    return {
      dimension,
      isRow,
      image,
      sliceArr,
      results: tasks.map(async (task, index) => {
        const { info, extra, hash } = task;
        const matchItem = cacheMatch && cacheMatch({ info, hash });
        if (matchItem) {
          return matchItem;
        } else {
          const extraFn = extra();
          const { data } = await extraFn.toBuffer({ resolveWithObject: true });
          const fileHash = getHash(data);

          const fileName = getOutput(output, name, index, fileHash);
          const itemBase = `${fileName}.${dimension.type}`;
          const resultPath = path.resolve(outputPath, itemBase);
          const url = path.join(urlPath || outputPath, itemBase);
          await extraFn.toFile(resultPath);
          return {
            resultPath,
            url,
            info,
            index,
            hash,
          };
        }
      }),
    };
  }
  const isArray = Object.prototype.toString.call(images) === "[object Array]";
  try {
    if (isArray) {
      const sharpsTasks = sharps(images as SharpParam[]);
      return sharpsTasks.map((sharpsTask) => deal(sharpsTask));
    } else {
      const { image, options } = images as SharpParam;
      return deal(sharpPic(image, options));
    }
  } catch (e) {
    throw e;
  }
}
