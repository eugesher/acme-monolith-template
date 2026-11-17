import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderRescheduleModel } from '../reminder-reschedule.model';

describe('ReminderRescheduleModel', () => {
  describe('reschedule', () => {
    let reminder: ReminderRescheduleModel;

    beforeEach(() => {
      reminder = ReminderRescheduleModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.PENDING,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });
    });

    it('moves the due date and bumps the version', () => {
      reminder.reschedule('2026-11-12');

      expect(reminder.toSnapshot().dueOn).toBe('2026-11-12');
      expect(reminder.version).toBe(4);
    });

    it('changes nothing for the current due date', () => {
      reminder.reschedule('2026-11-05');

      expect(reminder.toSnapshot().dueOn).toBe('2026-11-05');
      expect(reminder.version).toBe(3);
    });

    it('refuses a date that does not exist and keeps the current one', () => {
      expect(() => reminder.reschedule('2026-02-30')).toThrow(
        expect.objectContaining({ code: 'REMINDER_DUE_ON_INVALID' }) as Error,
      );
      expect(reminder.toSnapshot().dueOn).toBe('2026-11-05');
      expect(reminder.version).toBe(3);
    });

    it('refuses a done reminder with REMINDER_ALREADY_DONE', () => {
      const doneReminder = ReminderRescheduleModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.DONE,
        version: 4,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(() => doneReminder.reschedule('2026-11-12')).toThrow(
        expect.objectContaining({ code: 'REMINDER_ALREADY_DONE' }) as Error,
      );
      expect(doneReminder.toSnapshot().dueOn).toBe('2026-11-05');
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id, the due date and the version of the rescheduled reminder', () => {
      const reminder = ReminderRescheduleModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.PENDING,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(reminder.toLoggerPayload()).toEqual({ id: '7', dueOn: '2026-11-05', version: 3 });
    });
  });
});
