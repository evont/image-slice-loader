#!/usr/bin/env node
"use strict";
//TODO: can be used in cli
// --json for multiple image
// --img
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var path = require("path");
var fs = require("fs-extra");
var program = new commander_1.Command();
program
    .option("-i, --image [type]", "image to be sliced")
    .option("-d, --direction [type]", "direction")
    .option("-s, --slice [numbers]", "slice size")
    .option("-j, --json [type]", "image json file");
program.parse();
// console.log(program.opts());
function handleFile(file) {
    var isAbsolute = path.isAbsolute(file);
    if (!isAbsolute)
        file = path.resolve(process.cwd(), file);
    return file;
}
function exec(_a) {
    var image = _a.image, direction = _a.direction, slice = _a.slice, json = _a.json;
    if (json) {
        json = handleFile(json);
        var content = fs.readJsonSync(json);
        console.log(content);
    }
    else if (image) {
        image = handleFile(image);
    }
}
exec(program.opts());
