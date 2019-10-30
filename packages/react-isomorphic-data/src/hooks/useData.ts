import useBaseData from './utils/useBaseData';

import { AsyncDataState, DataHookOptions } from './types';

const useData = (
  url: string,
  queryParams: Record<string, any>,
  fetchOptions: RequestInit = {},
  dataOptions?: DataHookOptions,
): AsyncDataState => {
  const [, baseData] = useBaseData(url, queryParams, fetchOptions, false, dataOptions);

  return baseData;
};

export default useData;
