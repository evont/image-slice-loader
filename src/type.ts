export interface LoaderOptions {
  property?: string;
  output?: (name: string, index: number) => string | string;
  outputPath?: string;
  template?: string;
  sepTemplate?: string;
  handlebarsHelpers?: Record<string, () => any>;
}
export interface PluginOptions {
  loaderContext: any,
  options: LoaderOptions,
}