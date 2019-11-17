import getCacheKeys from './getCacheKeys';

const addToCache = (cache: Record<string, any>, url: string, data: Record<string, any>): Record<string, any> => {
  let temp = cache;
  const keys = getCacheKeys(url);
  const lastIndex = keys.length - 1;

  keys.forEach((k, index) => {
    if (index !== lastIndex) {
      // not the last key
      if (!temp[k]) temp[k] = {};

      temp = temp[k];
    } else {
      // add the data
      temp[k] = data;
    }
  });

  return cache;
};

export default addToCache;
