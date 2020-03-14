import * as React from 'react';

import baseGetData from './utils/baseGetData';
import { DataClient } from '../common/types';

const getDataFromTree = async (tree: React.ReactElement, client: DataClient): Promise<void> => {
  return baseGetData(tree, client);
}

export default getDataFromTree;
