import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { DataClient } from '../common/types';

const { renderToStaticMarkup } = ReactDOMServer;

const getDataFromTree = async (tree: React.ReactElement, client: DataClient): Promise<void> => {
  let prevPendingPromisesLength = 0;

  while (true) {
    renderToStaticMarkup(tree);

    const currPendingPromisesLength = client.pendingPromiseFactories.length;
    
    if (currPendingPromisesLength > prevPendingPromisesLength) {      
      const arrayOfPromises = client.pendingPromiseFactories.map((p, index) => {
        if (index >= prevPendingPromisesLength) {
          return p();
        } else {
          return new Promise(resolve => resolve());
        }
      });

      prevPendingPromisesLength = currPendingPromisesLength;
      
      await Promise.all(arrayOfPromises);
    } else {
      return;
    }
  }
}

export default getDataFromTree;
