export interface IPage<T> {
  page: number;
  limit: number;
  count: number;
  pageCount: number;
  total: number;
  data: T[];
}
