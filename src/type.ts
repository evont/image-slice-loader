export interface BgType {
  isLast: boolean;
  ind: number;
  url: string;
  offsetX?: number;
  offsetY?: number;
  top: string | number;
  left: string | number;
  height: string | number;
  width: string | number;
}
export interface SharpOption {
  output?: string | ((name: string, index: number, hash: string) => string);
  outputPath?: string;
}

export interface LoaderOptions extends SharpOption {
  property?: string;
  template?: (data: {
    bgs: BgType[],
    imgWidth: number | string;
    imgHeight: number | string;
  }) => string;
}
export interface PluginOptions {
  loaderContext: any,
  options: LoaderOptions,
}

export interface SharpPicOption {
  direction: "column" | "row";
  slice: number | number[]
}