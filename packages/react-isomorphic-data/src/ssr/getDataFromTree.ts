import * as React from 'react';

import baseGetData from './utils/baseGetData';

const getDataFromTree = async (tree: React.ReactElement): Promise<void> => {
  return baseGetData(tree);
}

export default getDataFromTree;
