export interface LoaderOptions {
  property?: string;
  outputPath?: string;
  clearOutput?: boolean;
  template?: string;
  output?: (name: string, index: number) => string | string;
}
export interface PluginOptions {
  loaderContext: any,
  options: LoaderOptions,
  oldCache: Record<string, {
    hash: string;
    bgs: string[]
  }>
}