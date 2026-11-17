import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { OccRetryHelper } from '@acme-libs/toolkit';

import {
  NoteVersionMismatchException,
  type INoteReconstitute,
  type NoteAggregate,
} from '../../domain';
import { NOTE_OCC_RETRY_ATTEMPTS_TOKEN } from '../../outbound';
import { NoteWriteConflictError } from '../errors/note-write-conflict.error';
import { NoteAccessService } from './note-access.service';
import type { INoteWriteReloadCommand, INoteWriteRunCommand } from '../interfaces';

@Injectable()
export class NoteWriteService {
  constructor(
    private readonly accessService: NoteAccessService,
    @Inject(NOTE_OCC_RETRY_ATTEMPTS_TOKEN)
    private readonly occRetryAttempts: number,
    @InjectPinoLogger(NoteWriteService.name)
    private readonly logger: PinoLogger,
  ) {}

  public async run<T>(command: INoteWriteRunCommand, attempt: () => Promise<T>): Promise<T> {
    const { noteId } = command;

    return await OccRetryHelper.run(attempt, {
      subject: 'Note',
      logger: this.logger,
      maxAttempts: this.occRetryAttempts,
      isConflict: (error): error is NoteWriteConflictError =>
        error instanceof NoteWriteConflictError,
      retryContext: (conflict) => ({ id: noteId, version: conflict.currentVersion }),
      exhaustedContext: () => ({ id: noteId }),
      onExhausted: (conflict, attempts) => {
        throw new NoteVersionMismatchException(noteId, attempts, conflict.currentVersion);
      },
    });
  }

  public async reload<TNote extends NoteAggregate>(
    command: INoteWriteReloadCommand,
    reconstitute: (record: INoteReconstitute) => TNote,
  ): Promise<TNote> {
    const { noteId, authorId, isSaved } = command;
    const note = await this.accessService.loadOwned({ noteId, authorId }, reconstitute);

    if (!isSaved) {
      throw new NoteWriteConflictError(noteId, note.version);
    }

    return note;
  }
}
