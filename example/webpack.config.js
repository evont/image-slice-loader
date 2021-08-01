const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageSlicePlugin = require("../dist").Plugin;

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "./"
  },
  resolveLoader: {
    alias: {
      "image-slice-loader": path.resolve(__dirname, "../dist"),
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve("./src/imgs")
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
              slice: 300,
            }
          },
        ],
      },
      // {
      //   test: /\.(png|jpe?g|webp|git|svg|)$/i,
      //   use: [
      //     {
      //       loader: 'image-slice-loader',
      //       options: {
      //         slices: 300
      //       }
      //     },
      //   ],
      // },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new ImageSlicePlugin({
      property: 'long-bg'
    }),
  ],
};
