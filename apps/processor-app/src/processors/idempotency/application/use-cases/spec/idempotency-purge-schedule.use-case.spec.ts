import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { IdempotencyPurgeScheduleUseCase } from '../idempotency-purge-schedule.use-case';
import type { IIdempotencyPurgeSchedulePort } from '../../../outbound';

describe('IdempotencyPurgeScheduleUseCase', () => {
  let schedule: jest.Mocked<IIdempotencyPurgeSchedulePort>;
  let logger: PinoLoggerMock;
  let useCase: IdempotencyPurgeScheduleUseCase;

  beforeEach(() => {
    schedule = { register: jest.fn() };
    schedule.register.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new IdempotencyPurgeScheduleUseCase(schedule, logger);
  });

  describe('execute', () => {
    it('registers the purge every five minutes and logs the pattern', async () => {
      await useCase.execute();

      expect(schedule.register).toHaveBeenCalledWith({ pattern: '*/5 * * * *' });
      expect(logger.info.mock.calls).toEqual([
        [{ pattern: '*/5 * * * *' }, 'Idempotency purge scheduled'],
      ]);
    });

    it('passes a failing registration through, so the app does not start without its schedule', async () => {
      schedule.register.mockRejectedValue(new Error('redis is down'));

      await expect(useCase.execute()).rejects.toThrow('redis is down');

      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
