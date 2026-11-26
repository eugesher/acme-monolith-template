export interface ICacheStoreSetCommand<T> {
  key: string;
  value: T;
  ttlMs: number;
}
