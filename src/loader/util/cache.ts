import * as findCacheDir from "find-cache-dir";
import { tmpdir } from "os";
import * as path from "path";
import * as fs from "fs-extra";
import { LOADER_NAME, CACHE_NAME } from "./constant";

const cacheDirectory = findCacheDir({ name: LOADER_NAME }) || tmpdir();
const cachePath = path.join(cacheDirectory, CACHE_NAME);

function removeOutput(bgs) {
  bgs?.forEach((bg) => {
    try {
      fs.removeSync(bg.filePath);
    } catch (err) {
      void err;
    }
  });
}

export function compareCache(newCache, oldCache) {
  if (!oldCache) return;
  for (const k in oldCache) {
    if (k in newCache) {
      const oldOpt = oldCache[k].options;
      const newOpt = newCache[k].options;
      for (const j in oldOpt) {
        if (j in newOpt) {
          void 0;
        } else {
          removeOutput(oldOpt[j].bgsResource);
          delete oldOpt[j];
        }
      }
    } else {
      for (const j in oldCache[k].options) {
        removeOutput(oldCache[k].options[j].bgsResource);
      }
      delete oldCache[k];
    }
  }
}

let tmpCache;
function getCache() {
  if (tmpCache) {
    return tmpCache;
  } else {
    tmpCache = fs.readJsonSync(cachePath, { throws: false });
    return tmpCache;
  }
}
export function getImageCache(imgHash, optionHash) {
  const cache = getCache();
  if (cache && imgHash in cache) {
    const { options } = cache[imgHash];
    if (optionHash in options) {
      return cache[imgHash];
    }
  }
}
export function setCache(data) {
  fs.outputJsonSync(cachePath, data);
}

export function invalidCache(newCache) {
  const oldCache = getCache();
  compareCache(newCache, oldCache);
}
