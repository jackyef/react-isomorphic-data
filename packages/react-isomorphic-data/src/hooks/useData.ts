import useBaseData from './utils/useBaseData';

import { DataState, DataHookOptions } from './types';

const useData = <T, >(
  url: string,
  queryParams: Record<string, any> = {},
  fetchOptions: RequestInit = {},
  dataOptions?: DataHookOptions,
): DataState<T> => {
  const [, baseData] = useBaseData<T>(url, queryParams, fetchOptions, false, dataOptions);

  if (process.env.NODE_ENV !== 'production') {
    if (dataOptions) {
      const { ssr, fetchPolicy } = dataOptions;
      const usedSSR = typeof ssr !== 'undefined' ? ssr : true;
      const usedFetchPolicy = typeof fetchPolicy !== 'undefined' ? fetchPolicy : 'cache-first';
  
      if (usedSSR && usedFetchPolicy === 'network-only') {
        console.warn(
          'You are doing SSR for data with `fetchPolicy` === "network-only". The cached value will automatically be discarded when hydrating on client, which is probably not what you want.',
          { url },
        );
      }
    }
  }

  return baseData;
};

export default useData;
