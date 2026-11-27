import { Injectable } from '@nestjs/common';

import { NoteGetOneModel } from '../../domain';
import { NoteAccessService } from '../services/note-access.service';
import type { INoteGetOneCommand, INoteView } from '../types';

@Injectable()
export class NoteGetOneCase {
  constructor(private readonly accessService: NoteAccessService) {}

  public async execute(command: INoteGetOneCommand): Promise<INoteView> {
    const { noteId, authorId } = command;
    const note = await this.accessService.loadOwned(
      { noteId, authorId },
      NoteGetOneModel.reconstitute,
    );

    return note.toSnapshot();
  }
}
