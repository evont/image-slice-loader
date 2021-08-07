export interface LoaderOptions {
  property?: string;
  outputPath?: string;
  clearOutput?: boolean;
  template?: string;
  blockFormate?: (name: string, index: number) => string;
}
export interface PluginOptions {
  loaderContext: any,
  options: LoaderOptions
}