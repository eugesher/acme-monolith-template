import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderCreateModel } from '../reminder-create.model';

describe('ReminderCreateModel', () => {
  describe('initCandidate', () => {
    it('initializes a pending reminder candidate at version 1 with a trimmed title and body', () => {
      const candidate = ReminderCreateModel.initCandidate({
        ownerId: 'owner-1',
        title: '  Call the bank  ',
        body: '  About the card  ',
        dueOn: '2026-11-05',
      });

      expect(candidate).toEqual({
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: 'About the card',
        dueOn: '2026-11-05',
        status: 'pending',
        version: 1,
      });
    });

    it('accepts an empty body', () => {
      const candidate = ReminderCreateModel.initCandidate({
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '   ',
        dueOn: '2026-11-05',
      });

      expect(candidate.body).toBe('');
    });

    it.each([
      ['a blank title', '   '],
      ['a title longer than 255', 't'.repeat(256)],
    ])('refuses %s with REMINDER_TITLE_INVALID', (_, title) => {
      expect(() =>
        ReminderCreateModel.initCandidate({
          ownerId: 'owner-1',
          title,
          body: '',
          dueOn: '2026-11-05',
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'REMINDER_TITLE_INVALID',
          message: 'Reminder.title must be a non-empty string of at most 255 characters',
        }) as Error,
      );
    });

    it('accepts a title of 255 characters and a body of 2000', () => {
      const candidate = ReminderCreateModel.initCandidate({
        ownerId: 'owner-1',
        title: 't'.repeat(255),
        body: 'b'.repeat(2000),
        dueOn: '2026-11-05',
      });

      expect(candidate.title).toHaveLength(255);
      expect(candidate.body).toHaveLength(2000);
    });

    it('refuses a body longer than 2000 with REMINDER_BODY_INVALID', () => {
      expect(() =>
        ReminderCreateModel.initCandidate({
          ownerId: 'owner-1',
          title: 'Call the bank',
          body: 'b'.repeat(2001),
          dueOn: '2026-11-05',
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'REMINDER_BODY_INVALID',
          message: 'Reminder.body must be at most 2000 characters',
        }) as Error,
      );
    });

    it.each([
      ['a date with a time', '2026-11-05T10:00:00Z'],
      ['a date without leading zeros', '2026-11-5'],
      ['an empty string', ''],
    ])('refuses %s as a malformed due date', (_, dueOn) => {
      expect(() =>
        ReminderCreateModel.initCandidate({
          ownerId: 'owner-1',
          title: 'Call the bank',
          body: '',
          dueOn,
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'REMINDER_DUE_ON_INVALID',
          message: `Reminder.dueOn must be a calendar date formatted YYYY-MM-DD, got ${dueOn}`,
        }) as Error,
      );
    });

    it.each([
      ['the 30th of February', '2026-02-30'],
      ['the 29th of February of a common year', '2026-02-29'],
      ['month 13', '2026-13-01'],
    ])('refuses %s as a date that does not exist', (_, dueOn) => {
      expect(() =>
        ReminderCreateModel.initCandidate({
          ownerId: 'owner-1',
          title: 'Call the bank',
          body: '',
          dueOn,
        }),
      ).toThrow(
        expect.objectContaining({
          code: 'REMINDER_DUE_ON_INVALID',
          message: `Reminder.dueOn is not a real calendar date: ${dueOn}`,
        }) as Error,
      );
    });

    it('accepts the 29th of February of a leap year', () => {
      const candidate = ReminderCreateModel.initCandidate({
        ownerId: 'owner-1',
        title: 'Call the bank',
        body: '',
        dueOn: '2028-02-29',
      });

      expect(candidate.dueOn).toBe('2028-02-29');
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id and the owner of the created reminder', () => {
      const reminder = ReminderCreateModel.reconstitute({
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

      expect(reminder.toLoggerPayload()).toEqual({ id: '7', ownerId: 'owner-1' });
    });
  });
});
