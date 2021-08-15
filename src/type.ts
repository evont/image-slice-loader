export interface ImageInfo {
  top: number;
  left: number;
  height: number;
  width: number;
}
export interface BgType extends ImageInfo {
  index: number;
  url: string;
  info?: ImageInfo;
  isRow: boolean;
}
export interface SharpOption {
  output?: string | ((name: string, index: number, hash: string) => string);
  outputPath?: string;
}

export interface LoaderOptions extends SharpOption {
  property?: string;
  cachePath?: string;
  template?: (data: {
    bgs: BgType[];
    isSep: boolean;
    selector: string;
    imgWidth: number | string;
    imgHeight: number | string;
  }) => string;
}
export interface PluginOptions {
  loaderContext: any;
  options: LoaderOptions;
}

export interface SharpPicOption {
  direction: "column" | "row";
  slice: number | number[];
}

export interface SharpParam {
  image: Buffer | string;
  options: SharpPicOption;
}

export interface ShareOutput {
  dimension: { width: number; height: number };
  isRow: boolean;
  image: Buffer | string;
  sliceArr: number[];
  results: Promise<{
    resultPath: string;
    info: ImageInfo;
    index: number;
    hash: string;
  }>[];
}

export interface SharpTask {
  info: ImageInfo;
  slice: number;
  extra: any;
  hash: string;
  data: Buffer;
}
export interface SharpReturn {
  dimension: { width: number; height: number; type?: string };
  image: string | Buffer;
  isRow: boolean;
  sliceArr: number[];
  tasks: Promise<SharpTask>[];
}
