import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { NoteResolveModel } from '../../domain';
import { NOTE_RESOLVE_REPOSITORY_PORT, type INoteResolveRepositoryPort } from '../../outbound';
import { NoteAccessService } from '../services/note-access.service';
import { NoteWriteService } from '../services/note-write.service';
import type { INoteResolveCommand, INoteView } from '../interfaces';

@Injectable()
export class NoteResolveUseCase {
  constructor(
    private readonly accessService: NoteAccessService,
    private readonly writeService: NoteWriteService,
    @Inject(NOTE_RESOLVE_REPOSITORY_PORT)
    private readonly repository: INoteResolveRepositoryPort,
    @InjectPinoLogger(NoteResolveUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: INoteResolveCommand): Promise<INoteView> {
    const { noteId } = command;
    const resolvedNote = await this.writeService.run({ noteId }, () => this.attempt(command));
    const noteLoggerPayload = resolvedNote.toLoggerPayload();

    this.logger.info(noteLoggerPayload, 'Note resolved');

    return resolvedNote.toSnapshot();
  }

  private async attempt(command: INoteResolveCommand): Promise<NoteResolveModel> {
    const { noteId, authorId } = command;
    const note = await this.accessService.loadOwned(
      { noteId, authorId },
      NoteResolveModel.reconstitute,
    );
    const versionAsRead = note.version;

    note.resolve();

    const noteUpdatePayload = note.toUpdatePayload(versionAsRead);
    const isSaved = await this.repository.update(noteUpdatePayload);

    return await this.writeService.reload(
      { noteId, authorId, isSaved },
      NoteResolveModel.reconstitute,
    );
  }
}
