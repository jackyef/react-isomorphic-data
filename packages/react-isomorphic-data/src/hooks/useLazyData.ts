import useBaseData from './utils/useBaseData';

import { LazyDataState, DataHookOptions } from './types';

const useData = (
  url: string,
  queryParams: Record<string, any>,
  fetchOptions: RequestInit = {},
  dataOptions?: DataHookOptions,
): LazyDataState => {
  const [fetchData, baseData] = useBaseData(url, queryParams, fetchOptions, true, dataOptions);

  return [fetchData, baseData];
};

export default useData;
