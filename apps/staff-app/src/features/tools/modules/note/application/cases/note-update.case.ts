import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { CorrelationContextHelper } from '@acme-libs/observability';

import { NoteUpdateModel } from '../../domain';
import {
  NOTE_TRANSACTION_PORT,
  NOTE_UPDATE_REPOSITORY_PORT,
  type INoteTransactionPort,
  type INoteUpdateRepositoryPort,
} from '../../outbound';
import { NoteWriteService } from '../services/note-write.service';
import type { INoteUpdateCommand, INoteUpdateSaveCommand, INoteView } from '../types';

@Injectable()
export class NoteUpdateCase {
  constructor(
    private readonly writeService: NoteWriteService,
    @Inject(NOTE_UPDATE_REPOSITORY_PORT)
    private readonly repository: INoteUpdateRepositoryPort,
    @Inject(NOTE_TRANSACTION_PORT)
    private readonly transaction: INoteTransactionPort,
    @InjectPinoLogger(NoteUpdateCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: INoteUpdateCommand): Promise<INoteView> {
    const { noteId, body, editorId, expectedVersion } = command;
    const writeResult = await this.writeService.write(
      { noteId, authorId: editorId, expectedVersion },
      NoteUpdateModel.reconstitute,
      (note) => note.update(body),
      (saveCommand) => this.transaction.run(() => this.save({ ...saveCommand, editorId })),
    );
    const { note, answer: isUpdated } = writeResult;
    const message = isUpdated ? 'Note updated' : 'Note update was a no-op';
    const noteLoggerPayload = note.toLoggerPayload();

    this.logger.info(noteLoggerPayload, message);

    return note.toSnapshot();
  }

  private async save(command: INoteUpdateSaveCommand): Promise<boolean> {
    const { note, versionAsRead, editorId } = command;
    const noteUpdatePayload = note.toUpdatePayload(versionAsRead);
    const isUpdated = await this.repository.update(noteUpdatePayload);

    if (!isUpdated) {
      return false;
    }

    const correlationId = CorrelationContextHelper.current(NoteUpdateCase.name);
    const noteRevisionInsertPayload = note.toRevisionInsertPayload({ editorId, correlationId });

    await this.repository.appendRevision(noteRevisionInsertPayload);

    return true;
  }
}
