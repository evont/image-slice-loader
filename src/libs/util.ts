// enhanced-resolve/lib/AliasPlugin
export function startsWith(string, searchString) {
  const stringLength = string.length;
  const searchLength = searchString.length;

  // early out if the search length is greater than the search string
  if (searchLength > stringLength) {
    return false;
  }
  let index = -1;
  while (++index < searchLength) {
    if (string.charCodeAt(index) !== searchString.charCodeAt(index)) {
      return false;
    }
  }
  return true;
}

export function useNumOnly(val: string | number, defaultVal = 0): number {
  return val && Number.isNaN(+val) ? defaultVal : +val;
}

export function transformPX(obj: Record<string, any>, pick?: string[]) {
  return (pick || Object.keys(obj)).reduce(
    (prev, val) => (
      val in obj &&
        (prev[val] = Number.isNaN(+obj[val]) ? obj[val] : `${obj[val]}px`),
      prev
    ),
    {}
  );
}
interface Alias {
  name: string;
  alias: string;
  onlyModule: boolean;
}
export function transformAlias(
  alias: Record<string, string | { alias: string }>
): Alias[] {
  return Object.keys(alias).map((key) => {
    let obj = alias[key];
    let onlyModule = false;
    let result: Alias;
    if (/\$$/.test(key)) {
      onlyModule = true;
      key = key.substr(0, key.length - 1);
    }
    result = Object.assign(
      {
        name: key,
        onlyModule,
      },
      typeof obj === "string"
        ? {
            alias: obj,
          }
        : obj
    );
    return result;
  });
}

export function getSlices(size: number, arr: number[]): number[] {
  if (!arr.length) return [size];
  const heights = [];
  const isMulti = arr.length > 1;
  while (size > 0) {
    const slice = isMulti ? arr.shift() || 0 : arr[0];
    if (size > slice && slice > 0) {
      heights.push(slice);
      size -= slice;
    } else {
      heights.push(size);
      size = 0;
    }
  }
  return heights;
}


export function getOutput(output: ((name: string, index: number, hash: string) => string) | string, name: string, ind: number, hash: string) {
  let result: string;
  if (typeof output === "string") {
    result = (output as string).replace(/\[name\]/g, name).replace(/\[index\]/g, `${ind}`).replace(/\[hash\]/g, hash);
  } else {
    result = output(name, ind, hash)
  }
  return result;
}
