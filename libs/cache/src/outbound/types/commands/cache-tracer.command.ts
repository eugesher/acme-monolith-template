export interface ICacheTracerSpanCommand<T> {
  name: string;
  attributes: Record<string, boolean | number | string>;
  work: (attributes: Record<string, boolean | number | string>) => Promise<T>;
}
