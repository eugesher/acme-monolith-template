import type { Job } from 'bullmq';

import { CorrelationContextHelper } from '@acme-libs/observability';
import type { ILedgerAppendProcessorPayload } from '@acme-core/contracts/ledger';

import { LedgerAppendProcessor } from '../ledger-append.processor';
import type {
  LedgerAppendProcessCase,
  LedgerAppendReportWorkerFailedCase,
} from '../../application';

describe('LedgerAppendProcessor', () => {
  let correlationIds: string[];
  let processCase: jest.Mocked<Pick<LedgerAppendProcessCase, 'execute'>>;
  let reportWorkerFailedCase: jest.Mocked<Pick<LedgerAppendReportWorkerFailedCase, 'execute'>>;
  let processor: LedgerAppendProcessor;

  beforeEach(() => {
    correlationIds = [];
    processCase = { execute: jest.fn() };
    processCase.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('LedgerAppendProcessCase'));

      return Promise.resolve();
    });
    reportWorkerFailedCase = { execute: jest.fn() };
    reportWorkerFailedCase.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('LedgerAppendReportWorkerFailedCase'));
    });
    processor = new LedgerAppendProcessor(
      processCase as unknown as LedgerAppendProcessCase,
      reportWorkerFailedCase as unknown as LedgerAppendReportWorkerFailedCase,
    );
  });

  describe('process', () => {
    it('appends the record inside the correlation context of the producer', async () => {
      await processor.process({
        data: {
          operationKey: 'product-created:12',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductCreated',
          payload: { sku: 'SKU-0001' },
          occurredAt: '2026-01-05T08:00:00.000Z',
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        },
      } as unknown as Job<ILedgerAppendProcessorPayload>);

      expect(processCase.execute).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductCreated',
        payload: { sku: 'SKU-0001' },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
      expect(correlationIds).toEqual(['c0ffee00-0000-4000-8000-000000000001']);
    });

    it('passes a failing append through, so BullMQ retries the job', async () => {
      processCase.execute.mockRejectedValue(new Error('deadlock'));

      const handling = processor.process({
        data: {
          operationKey: 'product-created:12',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductCreated',
          payload: {},
          occurredAt: '2026-01-05T08:00:00.000Z',
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        },
      } as unknown as Job<ILedgerAppendProcessorPayload>);

      await expect(handling).rejects.toThrow('deadlock');
    });
  });

  describe('onWorkerFailed', () => {
    it('reports the failed attempt inside the correlation context of the producer', async () => {
      await processor.onWorkerFailed(
        {
          data: {
            operationKey: 'product-created:12',
            subjectType: 'product',
            subjectId: '12',
            action: 'ProductCreated',
            payload: {},
            occurredAt: '2026-01-05T08:00:00.000Z',
            correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          },
          attemptsMade: 2,
          opts: { attempts: 3 },
        } as unknown as Job<ILedgerAppendProcessorPayload>,
        new Error('deadlock'),
      );

      expect(reportWorkerFailedCase.execute).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        attempt: 2,
        attempts: 3,
        error: new Error('deadlock'),
      });
      expect(correlationIds).toEqual(['c0ffee00-0000-4000-8000-000000000001']);
    });
  });
});
