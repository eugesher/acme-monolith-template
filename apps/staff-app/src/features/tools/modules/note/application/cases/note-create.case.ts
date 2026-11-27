import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, type PinoLogger } from 'nestjs-pino';

import { NoteCreateModel } from '../../domain';
import { NOTE_CREATE_REPOSITORY_PORT, type INoteCreateRepositoryPort } from '../../outbound';
import type { INoteCreateCommand, INoteView } from '../types';

@Injectable()
export class NoteCreateCase {
  constructor(
    @Inject(NOTE_CREATE_REPOSITORY_PORT)
    private readonly repository: INoteCreateRepositoryPort,
    @InjectPinoLogger(NoteCreateCase.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: INoteCreateCommand): Promise<INoteView> {
    const { subjectType, subjectId, title, body, authorId } = command;
    const noteCandidate = NoteCreateModel.initCandidate({
      subjectType,
      subjectId,
      title,
      body,
      authorId,
    });
    const noteId = await this.repository.insert(noteCandidate);
    const noteRecord = await this.repository.findInserted(noteId);
    const createdNote = NoteCreateModel.reconstitute(noteRecord);
    const noteLoggerPayload = createdNote.toLoggerPayload();

    this.logger.info(noteLoggerPayload, 'Note created');

    return createdNote.toSnapshot();
  }
}
