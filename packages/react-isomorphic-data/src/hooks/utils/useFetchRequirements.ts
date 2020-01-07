import * as React from 'react';
import { DataClient } from '../../common/types';
import createFetchRequirements from '../../common/utils/createFetchRequirements';
import { DataHookOptions } from '../../hooks/types';
import areShallowEqual from '../../utils/areShallowEqual';

// returns an array of FetchOptions and string of fetchPolicy
const useFetchRequirements = (
  fetchOptions: RequestInit,
  client: DataClient,
  dataOpts: DataHookOptions,
  lazy = false,
): [RequestInit, string] => {
  const prevFetchRequirements = React.useRef<[RequestInit, string]>();
  const prevFetchOpts = React.useRef<RequestInit>();
  const prevDataOpts = React.useRef<DataHookOptions>();

  const newFetchRequirements = createFetchRequirements(
    fetchOptions,
    client,
    dataOpts,
    lazy,
  );

  if (
    !prevFetchRequirements.current ||
    !areShallowEqual(fetchOptions, prevFetchOpts.current) ||
    !areShallowEqual(dataOpts, prevDataOpts.current)
  ) {
    // we need to use new fetchRequirements
    prevFetchRequirements.current = newFetchRequirements;  
  }

  prevFetchOpts.current = fetchOptions;  
  prevDataOpts.current = dataOpts;  

  return prevFetchRequirements.current;
};

export default useFetchRequirements;
