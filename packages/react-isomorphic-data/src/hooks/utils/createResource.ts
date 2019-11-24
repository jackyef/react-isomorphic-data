import * as React from 'react';

const createResource = (loading: boolean, usedData: any, promiseRef: React.MutableRefObject<Promise<any> | null>) => {
  const read = () => {
    console.log('read', {loading, promiseRef: promiseRef.current});
    if (loading && promiseRef.current instanceof Promise) {
      throw promiseRef.current;
    } else {
      return usedData;
    }
  }

  return {
    read,
  };
}

export default createResource;
