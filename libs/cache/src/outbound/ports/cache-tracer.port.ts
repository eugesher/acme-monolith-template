import type { ICacheTracerSpanCommand } from '../interfaces';

export interface ICacheTracerPort {
  span<T>(command: ICacheTracerSpanCommand<T>): Promise<T>;
}

export const CACHE_TRACER_PORT = Symbol('CACHE_TRACER_PORT');
