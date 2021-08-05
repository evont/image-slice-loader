const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

console.log(path.resolve(process.cwd(), "../dist"));
module.exports = {
  mode: "production",
  entry: path.resolve(process.cwd(), "./src/index.js"),
  output: {
    path: path.resolve(process.cwd(), "./dist"),
    publicPath: "./"
  },
  resolveLoader: {
    alias: {
      "image-slice-loader": path.resolve(process.cwd(), "../dist"),
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(process.cwd(), "./src/assets"),
      '@': path.resolve(process.cwd(), "./src")
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
              outputPath: "@assets/"
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
      template: path.resolve(process.cwd(), "./public/index.html")
    })
  ],
};
