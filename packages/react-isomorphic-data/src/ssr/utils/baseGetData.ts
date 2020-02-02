import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { DataClient } from '../../common/types';

const { renderToStaticMarkup } = ReactDOMServer;

const baseGetData = async (
  tree: React.ReactElement,
  client: DataClient,
  renderFunction: (tree: React.ReactElement) => string = renderToStaticMarkup,
): Promise<string> => {
  let prevPendingPromisesLength = 0;
  let lastMarkup: string;

  while (true) {
    lastMarkup = renderFunction(tree);

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
      return lastMarkup;
    }
  }
};

export default baseGetData;
