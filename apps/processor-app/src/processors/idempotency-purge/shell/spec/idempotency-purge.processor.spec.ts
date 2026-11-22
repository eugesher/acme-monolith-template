import { CorrelationContextHelper } from '@acme-libs/observability';

import { IdempotencyPurgeProcessor } from '../idempotency-purge.processor';
import type { IdempotencyPurgeScheduleUseCase, IdempotencyPurgeUseCase } from '../../application';

describe('IdempotencyPurgeProcessor', () => {
  let correlationIds: string[];
  let schedule: jest.Mocked<Pick<IdempotencyPurgeScheduleUseCase, 'execute'>>;
  let purge: jest.Mocked<Pick<IdempotencyPurgeUseCase, 'execute'>>;
  let processor: IdempotencyPurgeProcessor;

  beforeEach(() => {
    correlationIds = [];
    schedule = { execute: jest.fn() };
    schedule.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('IdempotencyPurgeScheduleUseCase'));

      return Promise.resolve();
    });
    purge = { execute: jest.fn() };
    purge.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('IdempotencyPurgeUseCase'));

      return Promise.resolve();
    });
    processor = new IdempotencyPurgeProcessor(
      schedule as unknown as IdempotencyPurgeScheduleUseCase,
      purge as unknown as IdempotencyPurgeUseCase,
    );
  });

  describe('onApplicationBootstrap', () => {
    it('registers the schedule inside a correlation context of its own', async () => {
      await processor.onApplicationBootstrap();

      expect(schedule.execute).toHaveBeenCalledWith();
      expect(purge.execute).not.toHaveBeenCalled();
      expect(correlationIds).toEqual([
        expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        ),
      ]);
    });
  });

  describe('process', () => {
    it('runs the purge inside a correlation context of its own', async () => {
      await processor.process();

      expect(purge.execute).toHaveBeenCalledWith();
      expect(correlationIds).toEqual([
        expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        ),
      ]);
    });

    it('opens a new correlation context on every job', async () => {
      await processor.process();
      await processor.process();

      expect(correlationIds).toHaveLength(2);
      expect(correlationIds[0]).not.toEqual(correlationIds[1]);
    });
  });
});
