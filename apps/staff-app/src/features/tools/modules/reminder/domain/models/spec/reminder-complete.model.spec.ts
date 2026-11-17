import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderCompleteModel } from '../reminder-complete.model';

describe('ReminderCompleteModel', () => {
  describe('reconstitute', () => {
    it('restores a stored reminder', () => {
      const reminder = ReminderCompleteModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: 'About the card',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.DONE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(reminder.toSnapshot()).toMatchObject({
        id: '7',
        status: 'done',
        version: 3,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });

    it.each([
      ['zero', 0],
      ['a fraction', 1.5],
    ])('refuses a version of %s with REMINDER_VERSION_INVALID', (_, version) => {
      expect(() =>
        ReminderCompleteModel.reconstitute({
          id: '7',
          ownerId: 'owner-1',
          title: 'Call the bank',
          body: '',
          dueOn: '2026-11-05',
          status: ReminderStatusEnum.PENDING,
          version,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'REMINDER_VERSION_INVALID',
          message: `Reminder.version must be a positive integer, got ${version}`,
        }) as Error,
      );
    });
  });

  describe('complete', () => {
    it('marks a pending reminder done and bumps the version', () => {
      const reminder = ReminderCompleteModel.reconstitute({
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

      reminder.complete();

      expect(reminder.toSnapshot().status).toBe('done');
      expect(reminder.version).toBe(4);
    });

    it('refuses a done reminder with REMINDER_ALREADY_DONE', () => {
      const reminder = ReminderCompleteModel.reconstitute({
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

      expect(() => reminder.complete()).toThrow(
        expect.objectContaining({
          code: 'REMINDER_ALREADY_DONE',
          message: 'Reminder 7 is already done',
        }) as Error,
      );
      expect(reminder.version).toBe(4);
    });
  });

  describe('toSnapshot', () => {
    it('maps a stored reminder with its instants as ISO strings', () => {
      const reminder = ReminderCompleteModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: 'About the card',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.PENDING,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      });

      expect(reminder.toSnapshot()).toEqual({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: 'About the card',
        dueOn: '2026-11-05',
        status: 'pending',
        version: 2,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });
  });

  describe('toUpdatePayload', () => {
    it('answers the row to update under the version as read', () => {
      const reminder = ReminderCompleteModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.PENDING,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      reminder.complete();

      expect(reminder.toUpdatePayload(2)).toEqual({
        id: '7',
        versionAsRead: 2,
        dueOn: '2026-11-05',
        status: 'done',
        version: 3,
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the version of the completed reminder', () => {
      const reminder = ReminderCompleteModel.reconstitute({
        id: '7',
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2026-11-05',
        status: ReminderStatusEnum.DONE,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      });

      expect(reminder.toLoggerPayload()).toEqual({ id: '7', version: 3 });
    });
  });
});
