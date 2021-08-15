#!/usr/bin/env node

//TODO: can be used in cli
// --json for multiple image
// --img

import { Command } from "commander";
import { sharps } from "./index";
import * as path from "path";
import * as fs from "fs-extra";
const program = new Command();

program
  .option("-i, --image [type]", "image to be sliced")
  .option("-d, --direction [type]", "direction")
  .option("-s, --slice [numbers]", "slice size")
  .option("-j, --json [type]", "image json file");

program.parse();
// console.log(program.opts());

function handleFile(file) {
  const isAbsolute = path.isAbsolute(file);
  if (!isAbsolute) file = path.resolve(process.cwd(), file);
  return file;
}
function exec({ image, direction, slice, json }) {
  if (json) {
    json = handleFile(json);
    const content = fs.readJsonSync(json);
    console.log(content);
  } else if (image) {
    image = handleFile(image);
  }
}

exec(program.opts());
