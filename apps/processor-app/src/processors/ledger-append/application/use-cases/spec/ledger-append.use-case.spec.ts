import { CorrelationContextHelper } from '@acme-libs/observability';
import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import {
  LedgerAppendEntryInsertOutcomeEnum,
  type ILedgerAppendRepositoryPort,
} from '../../../outbound';
import { LedgerAppendUseCase } from '../ledger-append.use-case';
import type { ILedgerAppendEntryCandidate } from '../../../domain';

describe('LedgerAppendUseCase', () => {
  let repository: jest.Mocked<ILedgerAppendRepositoryPort>;
  let logger: PinoLoggerMock;
  let useCase: LedgerAppendUseCase;

  beforeEach(() => {
    repository = { insert: jest.fn(), findByOperationKey: jest.fn() };
    repository.insert.mockResolvedValue({
      outcome: LedgerAppendEntryInsertOutcomeEnum.INSERTED,
      id: '4210',
    });
    repository.findByOperationKey.mockResolvedValue({ id: '4210' });
    logger = makePinoLoggerMock();
    useCase = new LedgerAppendUseCase(repository, logger);
  });

  describe('execute', () => {
    it('appends the entry under the correlation id of the context and logs the start and the result', async () => {
      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000001', () =>
        useCase.execute({
          operationKey: ' product-archived:12:2 ',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductArchived',
          payload: { previousStatus: 'active' },
          occurredAt: '2026-01-01T03:00:00+03:00',
        }),
      );

      const [candidate] = repository.insert.mock.calls[0] as [ILedgerAppendEntryCandidate];

      expect(candidate).toEqual({
        operationKey: 'product-archived:12:2',
        subjectType: 'product',
        subjectId: '12',
        action: 'ProductArchived',
        payload: { previousStatus: 'active' },
        correlationId: 'c0ffee00-0000-4000-8000-000000000001',
        occurredAt: new Date('2026-01-01T00:00:00.000Z'),
      });
      expect(logger.info.mock.calls).toEqual([
        [
          { operationKey: ' product-archived:12:2 ', action: 'ProductArchived' },
          'Ledger record received',
        ],
        [{ id: '4210', operationKey: 'product-archived:12:2' }, 'Ledger record appended'],
      ]);
    });

    it('logs a record the ledger already holds as already appended, without an error', async () => {
      repository.insert.mockResolvedValue({
        outcome: LedgerAppendEntryInsertOutcomeEnum.DUPLICATE,
      });

      await CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000002', () =>
        useCase.execute({
          operationKey: 'product-archived:12:2',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductArchived',
          payload: {},
          occurredAt: '2026-01-05T08:00:00.000Z',
        }),
      );

      expect(logger.info).toHaveBeenLastCalledWith(
        { id: '4210', operationKey: 'product-archived:12:2' },
        'Ledger record already appended',
      );
    });

    it('refuses an instant without a zone before touching storage', async () => {
      const executing = CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000003', () =>
        useCase.execute({
          operationKey: 'product-archived:12:2',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductArchived',
          payload: {},
          occurredAt: '2026-01-01T00:00:00',
        }),
      );

      await expect(executing).rejects.toThrow(
        'occurredAt must be an ISO-8601 instant with an explicit timezone offset',
      );
      expect(repository.insert).not.toHaveBeenCalled();
    });

    it('passes a failing append through, so Bull retries the job', async () => {
      repository.insert.mockRejectedValue(new Error('deadlock'));

      const executing = CorrelationContextHelper.run('c0ffee00-0000-4000-8000-000000000004', () =>
        useCase.execute({
          operationKey: 'product-created:12',
          subjectType: 'product',
          subjectId: '12',
          action: 'ProductCreated',
          payload: {},
          occurredAt: '2026-01-05T08:00:00.000Z',
        }),
      );

      await expect(executing).rejects.toThrow('deadlock');
      expect(logger.info).toHaveBeenCalledTimes(1);
    });
  });
});
