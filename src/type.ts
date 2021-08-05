export interface LoaderOptions {
  property?: string;
  slice?: number,
  direction?: "horizontal" | "vertical",
  outputPath?: string;
  clearOutput?: boolean;
  name?: string;
  template?: string;
  blockFormate?: (name: string, index: number) => string;
}
export interface PluginOptions {
  loaderContext: any,
  options: LoaderOptions
}