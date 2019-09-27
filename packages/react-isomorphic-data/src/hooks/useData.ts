import useBaseData from './utils/useBaseData';

import { AsyncDataState } from './types';

const useData = (url: string, queryParams: Record<string, any>, fetchOptions: RequestInit = {}): AsyncDataState => {
  const [, baseData] = useBaseData(url, queryParams, fetchOptions, false);
  
  return baseData;
};

export default useData;
