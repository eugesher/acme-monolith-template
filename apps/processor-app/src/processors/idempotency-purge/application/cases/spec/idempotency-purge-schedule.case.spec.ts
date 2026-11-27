import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { IdempotencyPurgeScheduleCase } from '../idempotency-purge-schedule.case';
import type { IIdempotencyPurgeSchedulePort } from '../../../outbound';

describe('IdempotencyPurgeScheduleCase', () => {
  let schedule: jest.Mocked<IIdempotencyPurgeSchedulePort>;
  let logger: PinoLoggerMock;
  let scheduleCase: IdempotencyPurgeScheduleCase;

  beforeEach(() => {
    schedule = { register: jest.fn() };
    schedule.register.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    scheduleCase = new IdempotencyPurgeScheduleCase(schedule, logger);
  });

  describe('execute', () => {
    it('registers the purge every five minutes and logs the pattern', async () => {
      await scheduleCase.execute();

      expect(schedule.register).toHaveBeenCalledWith({ pattern: '*/5 * * * *' });
      expect(logger.info.mock.calls).toEqual([
        [{ pattern: '*/5 * * * *' }, 'Idempotency purge scheduled'],
      ]);
    });

    it('passes a failing registration through, so the app does not start without its schedule', async () => {
      schedule.register.mockRejectedValue(new Error('redis is down'));

      await expect(scheduleCase.execute()).rejects.toThrow('redis is down');

      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
