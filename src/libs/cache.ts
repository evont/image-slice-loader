import * as findCacheDir from "find-cache-dir";
import { tmpdir } from "os";
import * as path from "path";
import * as fs from "fs-extra";
import { LOADER_NAME, CACHE_NAME } from "./constant";

const cacheDirectory = findCacheDir({ name: LOADER_NAME }) || tmpdir();
const cachePath = path.join(cacheDirectory, CACHE_NAME);

export function invalidCache(newCache, oldCache) {
  if (!oldCache) return;
  const oKeys = Object.keys(oldCache);

  oKeys.forEach((key) => {
    if (!(key in newCache)) {
      oldCache[key]?.bgs?.map((bg) => {
        try {
          fs.removeSync(bg);
        } catch (err) {
          void err;
        }
      });
    }
  });
}

export function getCache() {
  return fs.readJsonSync(cachePath, { throws: false });
}
export function setCache(data) {
  fs.outputJsonSync(cachePath, data);
}
