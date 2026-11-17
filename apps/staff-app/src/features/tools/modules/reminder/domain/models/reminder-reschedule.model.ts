import { ReminderAggregate } from '../aggregates/reminder.aggregate';
import type { IReminderReconstitute, IReminderRescheduleLoggerPayload } from '../interfaces';

export class ReminderRescheduleModel extends ReminderAggregate {
  public static reconstitute(this: void, record: IReminderReconstitute): ReminderRescheduleModel {
    return new ReminderRescheduleModel(record);
  }

  public reschedule(dueOn: string): void {
    this.assertPending();

    const validDueOn = ReminderRescheduleModel.validDueOn(dueOn);

    if (validDueOn === this.currentDueOn) {
      return;
    }

    this.currentDueOn = validDueOn;
    this.currentVersion += 1;
  }

  public toLoggerPayload(): IReminderRescheduleLoggerPayload {
    return { id: this.id, dueOn: this.currentDueOn, version: this.currentVersion };
  }
}
