import { Injectable, type ClassProvider } from '@nestjs/common';
import { SpanStatusCode, trace, type Exception } from '@opentelemetry/api';

import {
  CACHE_TRACER_PORT,
  type ICacheTracerPort,
  type ICacheTracerSpanCommand,
} from '../../outbound';

@Injectable()
export class CacheTracerAdapter implements ICacheTracerPort {
  public static readonly PROVIDER: ClassProvider<ICacheTracerPort> = {
    provide: CACHE_TRACER_PORT,
    useClass: CacheTracerAdapter,
  };

  private static readonly TRACER_NAME = '@acme-libs/cache';

  public async span<T>(command: ICacheTracerSpanCommand<T>): Promise<T> {
    const { name, attributes, work } = command;
    const tracer = trace.getTracer(CacheTracerAdapter.TRACER_NAME);

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
