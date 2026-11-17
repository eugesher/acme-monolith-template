import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderDeleteModel } from '../reminder-delete.model';

describe('ReminderDeleteModel', () => {
  describe('toLoggerPayload', () => {
    it('answers the id of the deleted reminder', () => {
      const reminder = ReminderDeleteModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.PENDING,
        version: 1,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(reminder.toLoggerPayload()).toEqual({ id: '7' });
    });
  });
});
