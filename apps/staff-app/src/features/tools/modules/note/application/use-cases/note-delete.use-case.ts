import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { NoteDeleteModel } from '../../domain';
import { NOTE_DELETE_REPOSITORY_PORT, type INoteDeleteRepositoryPort } from '../../outbound';
import { NoteAccessService } from '../services/note-access.service';
import type { INoteDeleteCommand } from '../interfaces';

@Injectable()
export class NoteDeleteUseCase {
  constructor(
    private readonly accessService: NoteAccessService,
    @Inject(NOTE_DELETE_REPOSITORY_PORT)
    private readonly repository: INoteDeleteRepositoryPort,
    @InjectPinoLogger(NoteDeleteUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: INoteDeleteCommand): Promise<void> {
    const { noteId, authorId } = command;

    const note = await this.accessService.loadOwned(
      { noteId, authorId },
      NoteDeleteModel.reconstitute,
    );
    await this.repository.softDelete(noteId);

    const noteLoggerPayload = note.toLoggerPayload();

    this.logger.info(noteLoggerPayload, 'Note deleted');
  }
}
