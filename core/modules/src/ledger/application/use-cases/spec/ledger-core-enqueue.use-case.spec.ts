import { LedgerActionEnum, LedgerSubjectTypeEnum } from '@acme-libs/kernel';
import { CorrelationContextHelper } from '@acme-libs/observability';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { LedgerCoreEnqueueUseCase } from '../ledger-core-enqueue.use-case';
import type { ILedgerCoreQueuePort } from '../../../outbound';

describe('LedgerCoreEnqueueUseCase', () => {
  let queue: jest.Mocked<ILedgerCoreQueuePort>;
  let logger: PinoLoggerMock;
  let useCase: LedgerCoreEnqueueUseCase;

  beforeEach(() => {
    queue = { add: jest.fn() };
    queue.add.mockResolvedValue();
    logger = makePinoLoggerMock();
    useCase = new LedgerCoreEnqueueUseCase(queue, 2, 500, logger);
  });

  describe('execute', () => {
    it('adds the record with the correlation id of the context once and logs it under its subject and operation key', async () => {
      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          operationKey: 'product-created:7',
          subjectType: LedgerSubjectTypeEnum.PRODUCT,
          subjectId: '7',
          action: LedgerActionEnum.PRODUCT_CREATED,
          payload: { name: 'Lamp' },
          occurredAt: '2026-01-05T08:00:00.000Z',
        }),
      );

      expect(queue.add).toHaveBeenCalledTimes(1);
      expect(queue.add).toHaveBeenCalledWith({
        record: {
          operationKey: 'product-created:7',
          subjectType: LedgerSubjectTypeEnum.PRODUCT,
          subjectId: '7',
          action: LedgerActionEnum.PRODUCT_CREATED,
          payload: { name: 'Lamp' },
          occurredAt: '2026-01-05T08:00:00.000Z',
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        },
        timeoutMs: 500,
      });
      expect(logger.info).toHaveBeenCalledWith(
        { subjectType: 'product', subjectId: '7', operationKey: 'product-created:7' },
        'Ledger record enqueued',
      );
    });

    it('retries a failed add and logs each retry', async () => {
      queue.add.mockRejectedValueOnce(new Error('redis is down')).mockResolvedValue(undefined);

      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          operationKey: 'product-created:7',
          subjectType: LedgerSubjectTypeEnum.PRODUCT,
          subjectId: '7',
          action: LedgerActionEnum.PRODUCT_CREATED,
          payload: {},
          occurredAt: '2026-01-05T08:00:00.000Z',
        }),
      );

      expect(queue.add).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledWith(
        {
          err: new Error('redis is down'),
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          attempt: 1,
          subjectType: 'product',
          subjectId: '7',
          operationKey: 'product-created:7',
        },
        'Ledger enqueue failed — retrying',
      );
      expect(logger.error).not.toHaveBeenCalled();
    });

    it('logs the record for replay after the configured attempts instead of throwing', async () => {
      queue.add.mockRejectedValue(new Error('redis is down'));

      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          operationKey: 'product-created:7',
          subjectType: LedgerSubjectTypeEnum.PRODUCT,
          subjectId: '7',
          action: LedgerActionEnum.PRODUCT_CREATED,
          payload: {},
          occurredAt: '2026-01-05T08:00:00.000Z',
        }),
      );

      expect(queue.add).toHaveBeenCalledTimes(2);
      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        {
          err: new Error('redis is down'),
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          subjectType: 'product',
          subjectId: '7',
          operationKey: 'product-created:7',
        },
        'Ledger enqueue failed permanently: the record may be absent from the queue and the ledger, replay this record',
      );
    });
  });
});
