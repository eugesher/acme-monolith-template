import { makePinoLoggerMock } from '@acme-libs/testing';

import { IdempotencyCoreReleaseUseCase } from '../idempotency-core-release.use-case';
import type { IIdempotencyCoreReleaseRepositoryPort } from '../../../outbound';

describe('IdempotencyCoreReleaseUseCase', () => {
  describe('execute', () => {
    it('deletes the key of the scope while it is still in flight and logs the release', async () => {
      const repository: jest.Mocked<IIdempotencyCoreReleaseRepositoryPort> = {
        deleteInFlight: jest.fn(),
      };

      repository.deleteInFlight.mockResolvedValue();

      const logger = makePinoLoggerMock();
      const useCase = new IdempotencyCoreReleaseUseCase(repository, logger);

      await useCase.execute({ scope: 'customer:101', key: 'key-1' });

      expect(repository.deleteInFlight).toHaveBeenCalledWith({
        scope: 'customer:101',
        key: 'key-1',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { scope: 'customer:101', idempotencyKey: 'key-1' },
        'Idempotency claim released',
      );
    });

    it('lets a failed delete reject without logging a release', async () => {
      const repository: jest.Mocked<IIdempotencyCoreReleaseRepositoryPort> = {
        deleteInFlight: jest.fn(),
      };

      repository.deleteInFlight.mockRejectedValue(new Error('connection lost'));

      const logger = makePinoLoggerMock();
      const useCase = new IdempotencyCoreReleaseUseCase(repository, logger);

      const execute = useCase.execute({ scope: 'customer:101', key: 'key-1' });

      await expect(execute).rejects.toThrow('connection lost');
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
