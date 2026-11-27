import { Injectable } from '@nestjs/common';

import { NoteGetDetailsModel } from '../../domain';
import { NoteAccessService } from '../services/note-access.service';
import type { INoteGetDetailsCommand, INoteView } from '../types';

@Injectable()
export class NoteGetDetailsCase {
  constructor(private readonly accessService: NoteAccessService) {}

  public async execute(command: INoteGetDetailsCommand): Promise<INoteView> {
    const { noteId, authorId } = command;
    const note = await this.accessService.loadOwned(
      { noteId, authorId },
      NoteGetDetailsModel.reconstitute,
    );

    return note.toSnapshot();
  }
}
