import * as React from 'react';

const createResource = (loading: boolean, usedData: any, promiseRef: React.MutableRefObject<Promise<any> | null>, error: any) => {
  const read = () => {
    if (loading && promiseRef.current instanceof Promise) {
      // let a SuspenseBoundary catch this
      throw promiseRef.current;
    } else if (error !== null) {
      // let an ErrorBoundary catch this
      throw error;
    } else {
      return usedData;
    }
  }

  return {
    read,
  };
}

export default createResource;
