export interface LoaderOptions {
  property?: string;
  output?: string | ((name: string, index: number, hash: string) => string);
  outputPath?: string;
  template?: string;
  sepTemplate?: string;
  handlebarsHelpers?: Record<string, () => any>;
}
export interface PluginOptions {
  loaderContext: any,
  options: LoaderOptions,
}