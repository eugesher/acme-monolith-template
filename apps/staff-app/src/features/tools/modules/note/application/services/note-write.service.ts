import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { OccRetryHelper } from '@acme-libs/toolkit';

import {
  NoteVersionConflictException,
  NoteVersionMismatchException,
  type INoteReconstitute,
  type NoteAggregate,
} from '../../domain';
import { NOTE_OCC_RETRY_ATTEMPTS_TOKEN } from '../../outbound';
import { NoteWriteConflictError } from '../errors/note-write-conflict.error';
import { NoteAccessService } from './note-access.service';
import type { INoteWriteCommand, INoteWriteSaveCommand, INoteWriteView } from '../types';

@Injectable()
export class NoteWriteService {
  constructor(
    private readonly accessService: NoteAccessService,
    @Inject(NOTE_OCC_RETRY_ATTEMPTS_TOKEN)
    private readonly occRetryAttempts: number,
    @InjectPinoLogger(NoteWriteService.name)
    private readonly logger: PinoLogger,
  ) {}

  public async write<TNote extends NoteAggregate, TAnswer>(
    command: INoteWriteCommand,
    reconstitute: (record: INoteReconstitute) => TNote,
    mutate: (note: TNote) => TAnswer,
    save: (saveCommand: INoteWriteSaveCommand<TNote>) => Promise<boolean>,
  ): Promise<INoteWriteView<TNote, TAnswer>> {
    const { noteId, expectedVersion } = command;
    const maxAttempts = expectedVersion === undefined ? this.occRetryAttempts : 1;

    return await OccRetryHelper.run(() => this.attempt(command, reconstitute, mutate, save), {
      subject: 'Note',
      logger: this.logger,
      maxAttempts,
      isConflict: (error): error is NoteWriteConflictError =>
        error instanceof NoteWriteConflictError,
      retryContext: (conflict) => ({ id: noteId, version: conflict.currentVersion }),
      exhaustedContext: () => ({ id: noteId }),
      onExhausted: (conflict, attempts) => {
        if (expectedVersion !== undefined) {
          throw new NoteVersionMismatchException(noteId, expectedVersion, conflict.currentVersion);
        }

        throw new NoteVersionConflictException(noteId, attempts, conflict.currentVersion);
      },
    });
  }

  private async attempt<TNote extends NoteAggregate, TAnswer>(
    command: INoteWriteCommand,
    reconstitute: (record: INoteReconstitute) => TNote,
    mutate: (note: TNote) => TAnswer,
    save: (saveCommand: INoteWriteSaveCommand<TNote>) => Promise<boolean>,
  ): Promise<INoteWriteView<TNote, TAnswer>> {
    const { noteId, authorId, expectedVersion } = command;
    const note = await this.accessService.loadOwned({ noteId, authorId }, reconstitute);

    note.assertExpectedVersion(expectedVersion);

    const versionAsRead = note.version;
    const answer = mutate(note);

    if (note.version === versionAsRead) {
      return { note, answer };
    }

    const isSaved = await save({ note, versionAsRead });
    const savedNote = await this.accessService.loadOwned({ noteId, authorId }, reconstitute);

    if (!isSaved) {
      throw new NoteWriteConflictError(noteId, savedNote.version);
    }

    return { note: savedNote, answer };
  }
}
