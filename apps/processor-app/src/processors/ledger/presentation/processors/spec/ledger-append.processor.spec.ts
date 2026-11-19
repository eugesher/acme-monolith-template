import type { Job } from 'bull';

import { CorrelationContextHelper } from '@acme-libs/observability';
import type { ILedgerRecordProcessorPayload } from '@acme-core/contracts/ledger';

import { LedgerAppendProcessor } from '../ledger-append.processor';
import type { LedgerAppendReportFailureUseCase, LedgerAppendUseCase } from '../../../application';

describe('LedgerAppendProcessor', () => {
  let correlationIds: string[];
  let append: jest.Mocked<Pick<LedgerAppendUseCase, 'execute'>>;
  let reportFailure: jest.Mocked<Pick<LedgerAppendReportFailureUseCase, 'execute'>>;
  let processor: LedgerAppendProcessor;

  beforeEach(() => {
    correlationIds = [];
    append = { execute: jest.fn() };
    append.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('LedgerAppendUseCase'));

      return Promise.resolve();
    });
    reportFailure = { execute: jest.fn() };
    reportFailure.execute.mockImplementation(() => {
      correlationIds.push(CorrelationContextHelper.current('LedgerAppendReportFailureUseCase'));
    });
    processor = new LedgerAppendProcessor(
      append as unknown as LedgerAppendUseCase,
      reportFailure as unknown as LedgerAppendReportFailureUseCase,
    );
  });

  describe('handleRecord', () => {
    it('appends the record inside the correlation context of the producer', async () => {
      await processor.handleRecord({
        data: {
          operationKey: 'product-created:12',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductCreated',
          payload: { sku: 'SKU-0001' },
          occurredAt: '2026-01-05T08:00:00.000Z',
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        },
      } as unknown as Job<ILedgerRecordProcessorPayload>);

      expect(append.execute).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductCreated',
        payload: { sku: 'SKU-0001' },
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
      expect(correlationIds).toEqual(['c0ffee00-0000-4000-8000-000000000001']);
    });

    it('passes a failing append through, so Bull retries the job', async () => {
      append.execute.mockRejectedValue(new Error('deadlock'));

      const handling = processor.handleRecord({
        data: {
          operationKey: 'product-created:12',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductCreated',
          payload: {},
          occurredAt: '2026-01-05T08:00:00.000Z',
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        },
      } as unknown as Job<ILedgerRecordProcessorPayload>);

      await expect(handling).rejects.toThrow('deadlock');
    });
  });

  describe('handleFailed', () => {
    it('reports the failed attempt inside the correlation context of the producer', async () => {
      await processor.handleFailed(
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
        } as unknown as Job<ILedgerRecordProcessorPayload>,
        new Error('deadlock'),
      );

      expect(reportFailure.execute).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        attempt: 2,
        attempts: 3,
        error: new Error('deadlock'),
      });
      expect(correlationIds).toEqual(['c0ffee00-0000-4000-8000-000000000001']);
    });

    it('treats a job without attempts as a single attempt', async () => {
      await processor.handleFailed(
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
          attemptsMade: 1,
          opts: {},
        } as unknown as Job<ILedgerRecordProcessorPayload>,
        new Error('deadlock'),
      );

      expect(reportFailure.execute).toHaveBeenCalledWith({
        operationKey: 'product-created:12',
        attempt: 1,
        attempts: 1,
        error: new Error('deadlock'),
      });
    });
  });
});
