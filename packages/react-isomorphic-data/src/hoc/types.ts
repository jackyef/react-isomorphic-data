import { DataHookOptions } from '../hooks/types';

export interface HocOptions {
  url: string;
  name: string;
  queryParams?: Record<string, any>;
  fetchOptions?: RequestInit;
  dataOptions?: DataHookOptions;
}