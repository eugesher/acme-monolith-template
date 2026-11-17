import { ReminderAggregate } from '../aggregates/reminder.aggregate';
import type { IReminderDeleteLoggerPayload, IReminderReconstitute } from '../interfaces';

export class ReminderDeleteModel extends ReminderAggregate {
  public static reconstitute(this: void, record: IReminderReconstitute): ReminderDeleteModel {
    return new ReminderDeleteModel(record);
  }

  public toLoggerPayload(): IReminderDeleteLoggerPayload {
    return { id: this.id };
  }
}
