import { Inject, Injectable } from '@nestjs/common';

import { ReminderNotFoundException } from '../../domain';
import {
  REMINDER_ACCESS_REPOSITORY_PORT,
  type IReminderAccessRecord,
  type IReminderAccessRepositoryPort,
} from '../../outbound';
import type { IReminderAccessLoadOwnedCommand } from '../interfaces';

@Injectable()
export class ReminderAccessService {
  constructor(
    @Inject(REMINDER_ACCESS_REPOSITORY_PORT)
    private readonly repository: IReminderAccessRepositoryPort,
  ) {}

  public async loadOwned<TReminder>(
    command: IReminderAccessLoadOwnedCommand,
    reconstitute: (record: IReminderAccessRecord) => TReminder,
  ): Promise<TReminder> {
    const { reminderId, ownerId } = command;
    const reminderRecord = await this.repository.findOwned({ reminderId, ownerId });

    if (!reminderRecord) {
      throw new ReminderNotFoundException(reminderId);
    }

    return reconstitute(reminderRecord);
  }
}
