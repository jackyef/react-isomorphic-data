import { DataClient } from '../common/types';

const createPrefetchTags = (dataClient: DataClient): string => {
  const { toBePrefetched } = dataClient;
  let output = '';
  
  Object.keys(toBePrefetched).forEach((url: string): void => {
    output += `<link rel="prefetch" href="${url}" />`;
  });

  return output;
};

export default createPrefetchTags;
