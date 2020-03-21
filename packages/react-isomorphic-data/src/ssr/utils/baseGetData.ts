import * as React from 'react';
import ssrPrepass from 'react-ssr-prepass'

const baseGetData = async (
  tree: React.ReactElement
): Promise<void> => {
  // we use `react-ssr-prepass` that will automatically suspends on thrown promise
  await ssrPrepass(tree);

  return;
};

export default baseGetData;
