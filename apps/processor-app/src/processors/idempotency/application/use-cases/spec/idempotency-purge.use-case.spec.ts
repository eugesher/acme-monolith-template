import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { IdempotencyPurgeUseCase } from '../idempotency-purge.use-case';
import type { IIdempotencyPurgeRepositoryPort } from '../../../outbound';

describe('IdempotencyPurgeUseCase', () => {
  let repository: jest.Mocked<IIdempotencyPurgeRepositoryPort>;
  let logger: PinoLoggerMock;
  let useCase: IdempotencyPurgeUseCase;

  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-01-02T12:00:00.000Z') });
    repository = { deleteCreatedBefore: jest.fn(), deleteInFlightCreatedBefore: jest.fn() };
    repository.deleteCreatedBefore.mockResolvedValue(3);
    repository.deleteInFlightCreatedBefore.mockResolvedValue(2);
    logger = makePinoLoggerMock();
    useCase = new IdempotencyPurgeUseCase(repository, 24, 5, logger);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('execute', () => {
    it('deletes the keys created more than the TTL ago', async () => {
      await useCase.execute();

      expect(repository.deleteCreatedBefore.mock.calls).toEqual([
        [new Date('2026-01-01T12:00:00.000Z')],
      ]);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('deletes the in-flight keys created more than the in-flight TTL ago', async () => {
      await useCase.execute();

      expect(repository.deleteInFlightCreatedBefore.mock.calls).toEqual([
        [new Date('2026-01-02T11:55:00.000Z')],
      ]);
    });

    it('logs both cutoffs, both counts and both TTLs', async () => {
      await useCase.execute();

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

    it('skips a tick that arrives while the previous purge is still running', async () => {
      let finish: (removed: number) => void = () => undefined;

      repository.deleteCreatedBefore.mockReturnValueOnce(
        new Promise<number>((resolve) => {
          finish = resolve;
        }),
      );

      const first = useCase.execute();

      await useCase.execute();
      finish(0);
      await first;

      expect(repository.deleteCreatedBefore).toHaveBeenCalledTimes(1);
      expect(logger.info.mock.calls[0]).toEqual([
        {},
        'Idempotency purge still running, this tick is skipped',
      ]);
    });

    it('purges again on the tick after the previous purge finished', async () => {
      await useCase.execute();
      await useCase.execute();

      expect(repository.deleteCreatedBefore).toHaveBeenCalledTimes(2);
    });

    it('logs a failed purge as a warning instead of throwing', async () => {
      const error = new Error('database is down');

      repository.deleteCreatedBefore.mockRejectedValue(error);

      await useCase.execute();

      expect(logger.warn.mock.calls).toEqual([
        [{ err: error }, 'Idempotency purge failed, the next tick retries'],
      ]);
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('purges again on the tick after a failed purge', async () => {
      repository.deleteCreatedBefore.mockRejectedValueOnce(new Error('database is down'));

      await useCase.execute();
      await useCase.execute();

      expect(repository.deleteCreatedBefore).toHaveBeenCalledTimes(2);
    });
  });
});
