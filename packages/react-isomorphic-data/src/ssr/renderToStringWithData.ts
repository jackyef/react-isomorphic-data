import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import baseGetData from './utils/baseGetData';
import { DataClient } from '../common/types';

const { renderToString } = ReactDOMServer;

const getDataFromTree = async (tree: React.ReactElement, client: DataClient): Promise<string> => {
  await baseGetData(tree, client);

  return renderToString(tree);
};

export default getDataFromTree;
