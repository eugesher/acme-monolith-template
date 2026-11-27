import { CorrelationContextHelper } from '@acme-libs/observability';

import { IdempotencyPurgeProcessor } from '../idempotency-purge.processor';
import type { IdempotencyPurgeProcessCase, IdempotencyPurgeScheduleCase } from '../../application';

describe('IdempotencyPurgeProcessor', () => {
  let correlationIds: string[];
  let scheduleCase: jest.Mocked<Pick<IdempotencyPurgeScheduleCase, 'execute'>>;
  let processCase: jest.Mocked<Pick<IdempotencyPurgeProcessCase, 'execute'>>;
  let processor: IdempotencyPurgeProcessor;

  beforeEach(() => {
    correlationIds = [];
    scheduleCase = { execute: jest.fn() };
    scheduleCase.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('IdempotencyPurgeScheduleCase'));

      return Promise.resolve();
    });
    processCase = { execute: jest.fn() };
    processCase.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('IdempotencyPurgeProcessCase'));

      return Promise.resolve();
    });
    processor = new IdempotencyPurgeProcessor(
      scheduleCase as unknown as IdempotencyPurgeScheduleCase,
      processCase as unknown as IdempotencyPurgeProcessCase,
    );
  });

  describe('onApplicationBootstrap', () => {
    it('registers the schedule inside a correlation context of its own', async () => {
      await processor.onApplicationBootstrap();

      expect(scheduleCase.execute).toHaveBeenCalledWith();
      expect(processCase.execute).not.toHaveBeenCalled();
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

      expect(processCase.execute).toHaveBeenCalledWith();
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
