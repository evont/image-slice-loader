const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "./",
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  resolveLoader: {
    alias: {
      "image-slice-loader": path.resolve(__dirname, "../dist"),
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve("./src/assets"),
      '@': path.resolve("./src"),
      '_$': path.resolve("./src")
    }
  },
  // watch: true,
  stats: "minimal",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "image-slice-loader",
            options: {
              outputPath: "@assets/slice",
              template: "./src/template.hbs",
              sepTemplate: "./src/template-sep.hbs",
              handlebarsHelpers: {
                getInd(ind) { return ind + 1}
              },
              output: "[hash]_slice_[index]"
            }
          },
        ],
      },
      {
        test: /\.(png|jpe?g|webp|git|svg|)$/i,
        type: 'asset/resource'
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
};
