import type { ICacheTracerSpanCommand } from '../types';

export interface ICacheTracerPort {
  span<T>(command: ICacheTracerSpanCommand<T>): Promise<T>;
}

export const CACHE_TRACER_PORT = Symbol('CACHE_TRACER_PORT');
