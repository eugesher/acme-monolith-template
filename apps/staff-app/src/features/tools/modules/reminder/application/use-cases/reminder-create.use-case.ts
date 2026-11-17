import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { ReminderCreateModel } from '../../domain';
import {
  REMINDER_CREATE_REPOSITORY_PORT,
  REMINDER_SUMMARY_PORT,
  type IReminderCreateRepositoryPort,
  type IReminderSummaryPort,
} from '../../outbound';
import type { IReminderCreateCommand, IReminderView } from '../interfaces';

@Injectable()
export class ReminderCreateUseCase {
  constructor(
    @Inject(REMINDER_CREATE_REPOSITORY_PORT)
    private readonly repository: IReminderCreateRepositoryPort,
    @Inject(REMINDER_SUMMARY_PORT)
    private readonly summary: IReminderSummaryPort,
    @InjectPinoLogger(ReminderCreateUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: IReminderCreateCommand): Promise<IReminderView> {
    const { ownerId, title, body, dueOn } = command;
    const reminderCandidate = ReminderCreateModel.initCandidate({
      ownerId,
      title,
      body: body ?? '',
      dueOn,
    });
    const reminderId = await this.repository.insert(reminderCandidate);
    const reminderRecord = await this.repository.findInserted(reminderId);
    const createdReminder = ReminderCreateModel.reconstitute(reminderRecord);

    await this.summary.invalidate(ownerId);

    const reminderLoggerPayload = createdReminder.toLoggerPayload();

    this.logger.info(reminderLoggerPayload, 'Reminder created');

    return createdReminder.toSnapshot();
  }
}
