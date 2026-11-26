import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { NoteResolveModel } from '../../domain';
import { NOTE_RESOLVE_REPOSITORY_PORT, type INoteResolveRepositoryPort } from '../../outbound';
import { NoteWriteService } from '../services/note-write.service';
import type { INoteResolveCommand, INoteView, INoteWriteSaveCommand } from '../types';

@Injectable()
export class NoteResolveUseCase {
  constructor(
    private readonly writeService: NoteWriteService,
    @Inject(NOTE_RESOLVE_REPOSITORY_PORT)
    private readonly repository: INoteResolveRepositoryPort,
    @InjectPinoLogger(NoteResolveUseCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: INoteResolveCommand): Promise<INoteView> {
    const { noteId, authorId, expectedVersion } = command;
    const writeResult = await this.writeService.write(
      { noteId, authorId, expectedVersion },
      NoteResolveModel.reconstitute,
      (note) => note.resolve(),
      (saveCommand) => this.save(saveCommand),
    );
    const { note } = writeResult;
    const noteLoggerPayload = note.toLoggerPayload();

    this.logger.info(noteLoggerPayload, 'Note resolved');

    return note.toSnapshot();
  }

  private async save(command: INoteWriteSaveCommand<NoteResolveModel>): Promise<boolean> {
    const { note, versionAsRead } = command;
    const noteUpdatePayload = note.toUpdatePayload(versionAsRead);

    return await this.repository.update(noteUpdatePayload);
  }
}
