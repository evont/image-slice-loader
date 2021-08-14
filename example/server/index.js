const { Sharp } = require("../../dist");
const path = require("path");
const fs = require("fs")
Sharp(
  [
    {
      image: path.resolve(__dirname, "./long.png"),
      options: {
        slice: 200,
        direction: "column",
      },
    },
    {
      image: fs.readFileSync(path.resolve(__dirname, "./long2.jpg")),
      options: {
        slice: 200,
        direction: "column",
      },
    },
    {
      image: path.resolve(__dirname, "./test.jpeg"),
      options: {
        slice: 200,
        direction: "column",
      },
    },
  ],
  {
    outputPath: path.resolve(__dirname, "slice"),
    output: "[hash]_[name]",
  }
);
