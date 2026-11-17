import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderAggregate } from '../aggregates/reminder.aggregate';
import type { IReminderCompleteLoggerPayload, IReminderReconstitute } from '../interfaces';

export class ReminderCompleteModel extends ReminderAggregate {
  public static reconstitute(this: void, record: IReminderReconstitute): ReminderCompleteModel {
    return new ReminderCompleteModel(record);
  }

  public complete(): void {
    this.assertPending();

    this.currentStatus = ReminderStatusEnum.DONE;
    this.currentVersion += 1;
  }

  public toLoggerPayload(): IReminderCompleteLoggerPayload {
    return { id: this.id, version: this.currentVersion };
  }
}
