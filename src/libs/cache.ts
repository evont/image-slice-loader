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

function removeOutput(bgs) {
  bgs?.forEach((bg) => {
    try {
      fs.removeSync(bg);
    } catch (err) {
      void err;
    }
  });
}

// const oldCache = {
//   '001': {
//     option: {
//       "0001": {
//         bgs: new Array(10).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//       "0002": {
//         bgs: new Array(4).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//     }
//   },
//   '002': {
//     width: 200,
//     height: 300,
//     option: {
//       "0001": {
//         bgs: new Array(10).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//       "0002": {
//         bgs: new Array(4).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//     }
//   }
// };

// const newCache = {
//   '002': {
//     width: 200,
//     height: 300,
//     option: {
//       "0001": {
//         bgs: new Array(10).fill("-").map((_, i) => `long-2__${i + 1}`),
//       },
//     }
//   }
// };

export function invalidateV2(newCache, oldCache) {
  if (!oldCache) return;
  for (const k in oldCache) {
    console.log(k, k in newCache)
    if (k in newCache) {
      const oldOpt = oldCache[k].option;
      const newOpt = newCache[k].option;
      for (const j in oldOpt) {
        if (j in newOpt) {
          console.log(`${k}-${j} is not modify in new cache`)
        } else {
          removeOutput(oldOpt[j].bgs); 
          delete oldOpt[j];
        }
      }
    } else {
      console.log(oldCache[k].option)
      for (const j in oldCache[k].option) {
        console.log(`removing ${k}-${j} in old`)
        removeOutput(oldCache[k].option[j].bgs);
      }
      delete oldCache[k];
    }
  }
}

export function getCacheV2(imgHash, optionHash) {
  const cache = fs.readJsonSync(cachePath, { throws: false });
  if (cache && imgHash in cache) {
    const { option } = cache[imgHash];
    if  (optionHash in option) {
      return option[optionHash];
    }
  }
}

export function getCache() {
  return fs.readJsonSync(cachePath, { throws: false });
}
export function setCache(data) {
  fs.outputJsonSync(cachePath, data);
}
