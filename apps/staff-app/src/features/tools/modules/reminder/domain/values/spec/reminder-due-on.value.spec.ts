import { ReminderDueOnValue } from '../reminder-due-on.value';

describe('ReminderDueOnValue', () => {
  describe('create', () => {
    it('holds the date as given', () => {
      const dueOn = ReminderDueOnValue.create('2026-03-01');

      expect(dueOn.isoDate).toBe('2026-03-01');
    });

    it('equals the same date', () => {
      const dueOn = ReminderDueOnValue.create('2026-03-01');
      const sameDueOn = ReminderDueOnValue.create('2026-03-01');

      expect(dueOn.equals(sameDueOn)).toBe(true);
    });
  });

  describe('isFormatted', () => {
    it('answers true for YYYY-MM-DD', () => {
      expect(ReminderDueOnValue.create('2026-03-01').isFormatted()).toBe(true);
    });

    it.each(['2026-3-1', '01.03.2026', '2026-03-01T00:00:00Z', ''])(
      'answers false for %j',
      (value) => {
        expect(ReminderDueOnValue.create(value).isFormatted()).toBe(false);
      },
    );
  });

  describe('isCalendarDate', () => {
    it.each(['2026-03-01', '2028-02-29'])('answers true for the real date %s', (value) => {
      expect(ReminderDueOnValue.create(value).isCalendarDate()).toBe(true);
    });

    it.each(['2026-02-30', '2026-13-01', '2027-02-29', 'not-a-date'])(
      'answers false for %s',
      (value) => {
        expect(ReminderDueOnValue.create(value).isCalendarDate()).toBe(false);
      },
    );
  });
});
