export interface HocOptions {
  url: string;
  name: string;
  queryParams?: Record<string, any>;
  fetchOptions?: RequestInit;
}