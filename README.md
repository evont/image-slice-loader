# image-slice-loader

A Webpack loader to cut image slices from long image to generate css background.

---

## Getting Started

To begin, you'll need to install `image-slice-loader`

```bash
npm install --save-dev image-slice-loader
```

you also need to combine `css-loader`, and make sure to add it `before` `css-loader` in your webpack config:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "css-loader",
          // "postcss-loader",
          {
            loader: "image-slice-loader",
            options: {
              outputPath: "@assets/slice",
              template: "./src/template.hbs",
              sepTemplate: "./src/template-sep.hbs",
              handlebarsHelpers: {
                getInd(ind) {
                  return ind + 1;
                },
              },
              output: "[hash]_[name]_slice_[index]",
            },
          },
        ]
      },
    ],
  },
};
```

after setup loaders of css, you can use this feature in your css with the follow ways:

  - You should always pass the background url as the first param. 
  
    The second param decides the background size in your css, output will still use the origin size.

    The third param is the slice size, background will be slice with this size (the final slice may be smaller then this)

    ```css
    #app {
      long-bg: url(@assets/long-1.png) 375 300;
    }
    ```

  - FEEL FREE If you want your background image to be sliced into different sizes, the third param can be a set of number, each number stands for the slice size.

    By the way, size is not in vertical only, you can also pass a `row` or `column` as the forth param, `row` means image will be sliced in horizontal direction, and `column` by default, means vertical direction

    ```css
    #app2 {
        long-bg:  url(@assets/deep/long-2.jpeg) 375 120, 325, 333,880, 550, 1000,900,650,920, 988 row;
    }
    ```

  - The final param determine whether the output css use seperate template or not, you can pass it with or without direction, if is seperate, the transformed css will be inserted after the parent of current css, if NOT, and default, the transformed css will be replace the custom css.

    ```css
    #app3 {
      long-bg:  url(@assets/long-3.png) 375 540, 425, 333,880, 550, 1000,900,650,920, 988 true;
    }
    ```


## Options

|                     Name                      |         Type         |   Default   | Description                                                |
| :-------------------------------------------: | :------------------: | :---------: | :--------------------------------------------------------- |
|        [**`property`**](#property)           |      `{String}`      | `long-bg`  | Custom CSS property name   |
|        [**`output`**](#output)      |      `{String\|Function(name, index, hash) -> {String}}`      |    `[hash]_[index]`     |  Output name formate for slice image                            |
|            [**`outputPath`**](#outputPath)             | `{String}` |   `./slice`    | Output path of slice images, relative to [webpack root context](https://v4.webpack.docschina.org/api/loaders/#this-rootcontext)            |
| [**`template`**](#template) | `{String}` | `''` | Template of virtual property transformed local CSS|
|              [**`sepTemplate`**](#sepTemplate)              |      `{String}`      |   `''`    | Template of virtual property transformed local CSS in seperate way.                        |
|          [**`handlebarsHelpers`**](#handlebarsHelpers)          |     `{Object}`      |   `true`    | helper for handlebars template        |

### `property`
Custom CSS property name, for example, if you use `long-pic`, your CSS will be like: 
```css
#app {
  long-pic: url(@assets/long-1.png) 375;
}
```

### `output`
Output filename format like output.filename of Webpack.

you can pass a string with following tokens will be replaced:
  - `[name]` the name of source background pic
  - `[hash]` the hash of source background pic 
  - `[index]` the index of current slice, start from 0

or, you can pass a function in  `(name, index, hash) => string` structure with the same params like above

### `outputPath`
Output path of slice images, relative to [webpack root context](https://v4.webpack.docschina.org/api/loaders/#this-rootcontext) 

you can use `alias` such as `@assets/slice` as your output path

### `template`
`handlebars` template path of virtual property transformed local CSS. other template engine will support in the future.

### `sepTemplate`
same like [**`template`**](#template), but it will be use when you want your css use a seperate selector or more customize

### handlebarsHelpers
Container for helpers to register to handlebars for your template