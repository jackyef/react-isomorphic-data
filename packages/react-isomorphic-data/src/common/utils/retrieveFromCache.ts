import getCacheKeys from './getCacheKeys';

const retrieveFromCache = (cache: Record<string, any>, url: string): any => {
  let temp = cache;

  const keys = getCacheKeys(url);
  let tempKey;

  while (tempKey = keys.shift()){
    if (!temp[tempKey]) return undefined;
    
    temp = temp[tempKey];
  }

  return temp.__raw;
};

export default retrieveFromCache;
