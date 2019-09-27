import useBaseData from './utils/useBaseData';

import { LazyAsyncDataState } from './types';

const useData = (url: string, queryParams: Record<string, any>, fetchOptions: RequestInit = {}): LazyAsyncDataState => {
  const [fetchData, baseData] = useBaseData(url, queryParams, fetchOptions, true);
  
  return [
    fetchData,
    baseData,
  ];
};

export default useData;
