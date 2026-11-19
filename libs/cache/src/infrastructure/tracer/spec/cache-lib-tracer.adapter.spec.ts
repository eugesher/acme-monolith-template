import { SpanStatusCode, trace, type Span, type Tracer } from '@opentelemetry/api';

import { CacheLibTracerAdapter } from '../cache-lib-tracer.adapter';

describe('CacheLibTracerAdapter', () => {
  let getTracer: jest.SpyInstance;
  let spans: {
    name: string;
    setAttributes: jest.Mock;
    recordException: jest.Mock;
    setStatus: jest.Mock;
    end: jest.Mock;
  }[];
  let tracer: CacheLibTracerAdapter;

  beforeEach(() => {
    spans = [];
    getTracer = jest.spyOn(trace, 'getTracer').mockReturnValue({
      startActiveSpan: (name: string, callback: (span: Span) => unknown) => {
        const span = {
          name,
          setAttributes: jest.fn(),
          recordException: jest.fn(),
          setStatus: jest.fn(),
          end: jest.fn(),
        };

        spans.push(span);

        return callback(span as unknown as Span);
      },
    } as unknown as Tracer);
    tracer = new CacheLibTracerAdapter();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('runs the work in an active span of the cache tracer and returns its result', async () => {
    const result = await tracer.span({
      name: 'cache.get',
      attributes: { 'cache.key': 'k' },
      work: () => Promise.resolve('v'),
    });

    expect(result).toBe('v');
    expect(getTracer).toHaveBeenCalledWith('@acme-libs/cache');
    expect(spans[0].name).toBe('cache.get');
    expect(spans[0].end).toHaveBeenCalledTimes(1);
  });

  it('records the attributes the work adds, without touching the given ones', async () => {
    const attributes = { 'cache.key': 'k' };

    await tracer.span({
      name: 'cache.get',
      attributes,
      work: (collected) => {
        collected['cache.hit'] = true;

        return Promise.resolve();
      },
    });

    expect(spans[0].setAttributes).toHaveBeenCalledWith({ 'cache.key': 'k', 'cache.hit': true });
    expect(attributes).toEqual({ 'cache.key': 'k' });
  });

  it('marks the span as failed with the exception, ends it and passes the failure on', async () => {
    const span = tracer.span({
      name: 'cache.get',
      attributes: { 'cache.key': 'k' },
      work: () => Promise.reject(new Error('read failed')),
    });

    await expect(span).rejects.toThrow('read failed');
    expect(spans[0].recordException).toHaveBeenCalledWith(new Error('read failed'));
    expect(spans[0].setStatus).toHaveBeenCalledWith({ code: SpanStatusCode.ERROR });
    expect(spans[0].setAttributes).toHaveBeenCalledWith({ 'cache.key': 'k' });
    expect(spans[0].end).toHaveBeenCalledTimes(1);
  });

  it('leaves the status of a span whose work succeeds', async () => {
    await tracer.span({
      name: 'cache.get',
      attributes: { 'cache.key': 'k' },
      work: () => Promise.resolve('v'),
    });

    expect(spans[0].recordException).not.toHaveBeenCalled();
    expect(spans[0].setStatus).not.toHaveBeenCalled();
  });
});
