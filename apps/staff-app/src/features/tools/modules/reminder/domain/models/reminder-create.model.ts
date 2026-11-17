import { ReminderStatusEnum } from '@acme-libs/kernel';

import { ReminderAggregate } from '../aggregates/reminder.aggregate';
import type {
  IReminderCreateCandidate,
  IReminderCreateCandidateInit,
  IReminderCreateLoggerPayload,
  IReminderReconstitute,
} from '../interfaces';

export class ReminderCreateModel extends ReminderAggregate {
  public static initCandidate(proposal: IReminderCreateCandidateInit): IReminderCreateCandidate {
    const { ownerId, title, body, dueOn } = proposal;
    const validTitle = ReminderCreateModel.validTitle(title);
    const validBody = ReminderCreateModel.validBody(body);
    const validDueOn = ReminderCreateModel.validDueOn(dueOn);

    return {
      ownerId,
      title: validTitle,
      body: validBody,
      dueOn: validDueOn,
      status: ReminderStatusEnum.PENDING,
      version: 1,
    };
  }

  public static reconstitute(this: void, record: IReminderReconstitute): ReminderCreateModel {
    return new ReminderCreateModel(record);
  }

  public toLoggerPayload(): IReminderCreateLoggerPayload {
    return { id: this.id, ownerId: this.ownerId };
  }
}
