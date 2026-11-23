import { Inject, Injectable } from '@nestjs/common';

import { NoteNotFoundException } from '../../domain';
import {
  NOTE_ACCESS_REPOSITORY_PORT,
  type INoteAccessRecord,
  type INoteAccessRepositoryPort,
} from '../../outbound';
import type { INoteAccessLoadOwnedCommand } from '../types';

@Injectable()
export class NoteAccessService {
  constructor(
    @Inject(NOTE_ACCESS_REPOSITORY_PORT)
    private readonly repository: INoteAccessRepositoryPort,
  ) {}

  public async loadOwned<TNote>(
    command: INoteAccessLoadOwnedCommand,
    reconstitute: (record: INoteAccessRecord) => TNote,
  ): Promise<TNote> {
    const noteRecord = await this.findOwned(command);

    return reconstitute(noteRecord);
  }

  public async assertOwned(command: INoteAccessLoadOwnedCommand): Promise<void> {
    await this.findOwned(command);
  }

  private async findOwned(command: INoteAccessLoadOwnedCommand): Promise<INoteAccessRecord> {
    const { noteId, authorId } = command;
    const noteRecord = await this.repository.findOwned({ noteId, authorId });

    if (!noteRecord) {
      throw new NoteNotFoundException(noteId);
    }

    return noteRecord;
  }
}
