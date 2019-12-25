import useBaseData from './utils/useBaseData';

import { LazyDataState, DataHookOptions } from './types';

const useData = <T, > (
  url: string,
  queryParams: Record<string, any> = {},
  fetchOptions: RequestInit = {},
  dataOptions?: DataHookOptions,
): LazyDataState<T> => {
  const [fetchData, baseData] = useBaseData<T>(url, queryParams, fetchOptions, true, dataOptions);

  return [fetchData, baseData];
};

export default useData;
