export interface IPageBuildOptions<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
