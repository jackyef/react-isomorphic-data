import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import baseGetData from './utils/baseGetData';

const { renderToString } = ReactDOMServer;

const getDataFromTree = async (tree: React.ReactElement): Promise<string> => {
  await baseGetData(tree);

  return renderToString(tree);
};

export default getDataFromTree;
