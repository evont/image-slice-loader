import sizeOf from "image-size";
import * as sharp from "sharp";
import * as path from "path";
import * as fs from "fs-extra";
import { SharpOption, SharpPicOption } from "../type";
import { getSlices, getHash, getOutput } from "./util";

async function sharpPic(image: Buffer | string, options: SharpPicOption) {
  let { direction, slice } = options;
  if (typeof slice === "number") slice = [slice];

  const isRow = direction === "row";

  const dimension = await sizeOf(image);
  const { width: imgWidth, height: imgHeight, type } = dimension;

  const imgSize = isRow ? imgWidth : imgHeight;
  const sliceArr = getSlices(imgSize, slice);
  // console.log(sliceArr);
  let offsetX = 0;
  let offsetY = 0;
  return {
    dimension,
    tasks: Promise.all(
      sliceArr.map((slice) => {
        const width = isRow ? slice : imgWidth;
        const height = isRow ? imgHeight : slice;
        const left = offsetX;
        const top = offsetY;

        offsetX += isRow ? width : 0;
        offsetY += isRow ? 0 : height;
        return sharp(image).extract({
          left,
          top,
          width,
          height,
        });
      })
    ),
  };
}

export default async (
  images: { image: Buffer | string; options: SharpPicOption }[],
  options: SharpOption
) => {
  const { outputPath, output } = options;
  fs.ensureDirSync(outputPath);
  images.forEach(async (item, ind) => {
    let result;
    const { image, options } = item;
    let name = Buffer.isBuffer(image)
      ? getHash(image).substr(0, 7)
      : path.basename(image, path.extname(image));
    try {
      result = await sharpPic(image, options);
      const { dimension, tasks } = result;
      (await tasks).forEach(async (item, index) => {
        const { data, info } = await item.toBuffer({ resolveWithObject: true });
        const itemHash = getHash(data);
        const fileName = getOutput(output, name, ind, itemHash);
        const itemBase = `${fileName}.${dimension.type}`;
        const resultPath = path.resolve(outputPath, itemBase);
        await item.toFile(resultPath);

        // console.log(item);
        // item.toFile(path.resolve(outputPath, ))
      });
    } catch (e) {
      console.error(e);
    }
  });
};
