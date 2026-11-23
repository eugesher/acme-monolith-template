export interface ICacheWrapCommand<T> {
  key: string;
  ttlMs: number;
  compute: () => Promise<T>;
}
