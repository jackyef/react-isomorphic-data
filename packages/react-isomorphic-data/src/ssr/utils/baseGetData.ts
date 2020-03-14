import * as React from 'react';
import ssrPrepass from 'react-ssr-prepass'

import { DataClient } from '../../common/types';

const baseGetData = async (
  tree: React.ReactElement,
  client: DataClient
): Promise<void> => {
  let prevPendingPromisesLength = 0;

  while (true) {
    // require('react-dom/server').renderToStaticMarkup(tree);
    await ssrPrepass(tree);

    const currPendingPromisesLength = client.pendingPromiseFactories.length;

    if (currPendingPromisesLength > prevPendingPromisesLength) {
      const arrayOfPromises = client.pendingPromiseFactories.map((p, index) => {
        if (index >= prevPendingPromisesLength) {
          return p();
        } else {
          return new Promise((resolve) => resolve());
        }
      });

      prevPendingPromisesLength = currPendingPromisesLength;

      await Promise.all(arrayOfPromises);
    } else {
      break;
    }
  }
};

export default baseGetData;
