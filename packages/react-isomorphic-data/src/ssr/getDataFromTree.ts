import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { DataClient } from '../common/types';

const { renderToStaticMarkup } = ReactDOMServer;

const getDataFromTree = async (tree: React.ReactElement, client: DataClient): Promise<void> => {
  let prevPendingPromisesLength = 0;

  while (true) {
    renderToStaticMarkup(tree);

    const currPendingPromisesLength = client.pendingPromises.length;
    
    if (currPendingPromisesLength > prevPendingPromisesLength) {
      prevPendingPromisesLength = currPendingPromisesLength;

      await Promise.all(client.pendingPromises);
    } else {
      return;
    }
  }
}

export default getDataFromTree;
