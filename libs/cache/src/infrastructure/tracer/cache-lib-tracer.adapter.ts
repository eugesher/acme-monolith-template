import { Injectable, type ClassProvider } from '@nestjs/common';
import { SpanStatusCode, trace, type Exception } from '@opentelemetry/api';

import {
  CACHE_LIB_TRACER_PORT,
  type ICacheLibTracerPort,
  type ICacheLibTracerSpanCommand,
} from '../../outbound';

@Injectable()
export class CacheLibTracerAdapter implements ICacheLibTracerPort {
  public static readonly provider: ClassProvider<ICacheLibTracerPort> = {
    provide: CACHE_LIB_TRACER_PORT,
    useClass: CacheLibTracerAdapter,
  };

  private static readonly TRACER_NAME = '@acme-libs/cache';

  public async span<T>(command: ICacheLibTracerSpanCommand<T>): Promise<T> {
    const { name, attributes, work } = command;
    const tracer = trace.getTracer(CacheLibTracerAdapter.TRACER_NAME);

    return await tracer.startActiveSpan(name, async (span) => {
      const collected = { ...attributes };

      try {
        return await work(collected);
      } catch (error) {
        span.recordException(error as Exception);
        span.setStatus({ code: SpanStatusCode.ERROR });

        throw error;
      } finally {
        span.setAttributes(collected);
        span.end();
      }
    });
  }
}
