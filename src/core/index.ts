import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs-extra";
import { SharpOption, SharpPicOption } from "../type";
import { getSlices, getHash, getOutput } from "./util";

function sharpPic(image: Buffer | string, options: SharpPicOption) {
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
      tasks: Promise.all(
        sliceArr.map((slice, ind) => {
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
          return {
            info,
            ind,
            extra: sharp(image).extract(info),
          };
        })
      ),
    };
  } catch (e) {
    throw e;
  }
}

export function sharps(
  images: { image: Buffer | string; options: SharpPicOption }[]
) {
  return images
    .map(({ image, options }) => sharpPic(image, options))
    .filter(Boolean);
}

export async function outputSharp(
  images: { image: Buffer | string; options: SharpPicOption }[],
  options: SharpOption
) {
  const { outputPath, output } = options;
  fs.ensureDirSync(outputPath);
  try {
    const tasks = sharps(images);
    tasks.forEach(async (result, ind) => {
      const { dimension, tasks, image } = await result;
      const name = Buffer.isBuffer(image)
        ? getHash(image).substr(0, 7)
        : path.basename(image, path.extname(image));
      (await tasks).map(async (task, index) => {
        const { info, extra } = task;
        const { data } = await extra.toBuffer({ resolveWithObject: true });
        const itemHash = getHash(data);
        const fileName = getOutput(output, name, ind, itemHash);
        const itemBase = `${fileName}.${dimension.type}`;
        const resultPath = path.resolve(outputPath, itemBase);
        await extra.toFile(resultPath);
      });
    });
  } catch (e) {
    throw e;
  }
}
