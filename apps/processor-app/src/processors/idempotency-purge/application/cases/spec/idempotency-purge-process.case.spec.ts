import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { IdempotencyPurgeProcessCase } from '../idempotency-purge-process.case';
import type { IIdempotencyPurgeProcessRepositoryPort } from '../../../outbound';

describe('IdempotencyPurgeProcessCase', () => {
  let repository: jest.Mocked<IIdempotencyPurgeProcessRepositoryPort>;
  let logger: PinoLoggerMock;
  let processCase: IdempotencyPurgeProcessCase;

  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-01-02T12:00:00.000Z') });
    repository = { deleteCreatedBefore: jest.fn(), deleteInFlightCreatedBefore: jest.fn() };
    repository.deleteCreatedBefore.mockResolvedValue(3);
    repository.deleteInFlightCreatedBefore.mockResolvedValue(2);
    logger = makePinoLoggerMock();
    processCase = new IdempotencyPurgeProcessCase(repository, 24, 5, logger);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('execute', () => {
    it('deletes the keys created more than the TTL ago', async () => {
      await processCase.execute();

      expect(repository.deleteCreatedBefore.mock.calls).toEqual([
        [new Date('2026-01-01T12:00:00.000Z')],
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('deletes the in-flight keys created more than the in-flight TTL ago', async () => {
      await processCase.execute();

      expect(repository.deleteInFlightCreatedBefore.mock.calls).toEqual([
        [new Date('2026-01-02T11:55:00.000Z')],
      ]);
    });

    it('logs both cutoffs, both counts and both TTLs', async () => {
      await processCase.execute();

      expect(logger.info.mock.calls).toEqual([
        [
          {
            cutoff: '2026-01-01T12:00:00.000Z',
            removed: 3,
            ttlHours: 24,
            inFlightCutoff: '2026-01-02T11:55:00.000Z',
            removedInFlight: 2,
            inFlightTtlMinutes: 5,
          },
          'Expired idempotency keys purged',
        ],
      ]);
    });

    it('logs a failed purge as a warning instead of throwing', async () => {
      const error = new Error('database is down');

      repository.deleteCreatedBefore.mockRejectedValue(error);

      await processCase.execute();

      expect(logger.warn.mock.calls).toEqual([
        [{ err: error }, 'Idempotency purge failed, the next tick retries'],
      ]);
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
