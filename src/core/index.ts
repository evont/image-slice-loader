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
    const { width: imgWidth, height: imgHeight, type } = dimension;

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
      tasks: sliceArr.map(async (slice) => {
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
        const extra = sharp(image).extract(info);
        const { data } = await extra.toBuffer({ resolveWithObject: true });
        const hash = getHash(data);
        return {
          info,
          slice,
          extra,
          hash,
          data
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
  taskFilter?: (task: Partial<SharpTask>) => Boolean;
}
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
  const { outputPath, output, taskFilter } = options;
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
        const { info, extra, hash } = await task;
        const fileName = getOutput(output, name, index, hash);
        const itemBase = `${fileName}.${dimension.type}`;
        const resultPath = path.resolve(outputPath, itemBase);
        const filter = taskFilter && taskFilter({ info, hash });

        if (filter) {

        } else {
          
        }

        // console.log(info);
        //  await extra.toFile(resultPath);

        return {
          resultPath,
          info,
          index,
          hash
        };
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
