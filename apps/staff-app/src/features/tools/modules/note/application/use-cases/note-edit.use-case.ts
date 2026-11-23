import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { CorrelationContextHelper } from '@acme-libs/observability';

import { NoteEditModel } from '../../domain';
import {
  NOTE_EDIT_REPOSITORY_PORT,
  NOTE_TRANSACTION_PORT,
  type INoteEditRepositoryPort,
  type INoteTransactionPort,
} from '../../outbound';
import { NoteWriteService } from '../services/note-write.service';
import type { INoteEditCommand, INoteEditSaveCommand, INoteView } from '../types';

@Injectable()
export class NoteEditUseCase {
  constructor(
    private readonly writeService: NoteWriteService,
    @Inject(NOTE_EDIT_REPOSITORY_PORT)
    private readonly repository: INoteEditRepositoryPort,
    @Inject(NOTE_TRANSACTION_PORT)
    private readonly transaction: INoteTransactionPort,
    @InjectPinoLogger(NoteEditUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: INoteEditCommand): Promise<INoteView> {
    const { noteId, body, editorId, expectedVersion } = command;
    const writeResult = await this.writeService.write(
      { noteId, authorId: editorId, expectedVersion },
      NoteEditModel.reconstitute,
      (note) => note.edit(body),
      (saveCommand) => this.transaction.run(() => this.save({ ...saveCommand, editorId })),
    );
    const { note, answer: isEdited } = writeResult;
    const message = isEdited ? 'Note edited' : 'Note edit was a no-op';
    const noteLoggerPayload = note.toLoggerPayload();

    this.logger.info(noteLoggerPayload, message);

    return note.toSnapshot();
  }

  private async save(command: INoteEditSaveCommand): Promise<boolean> {
    const { note, versionAsRead, editorId } = command;
    const noteUpdatePayload = note.toUpdatePayload(versionAsRead);
    const isUpdated = await this.repository.update(noteUpdatePayload);

    if (!isUpdated) {
      return false;
    }

    const correlationId = CorrelationContextHelper.current(NoteEditUseCase.name);
    const noteRevisionInsertPayload = note.toRevisionInsertPayload({ editorId, correlationId });

    await this.repository.appendRevision(noteRevisionInsertPayload);

    return true;
  }
}
