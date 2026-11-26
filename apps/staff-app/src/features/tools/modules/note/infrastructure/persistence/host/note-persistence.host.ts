import { Inject } from '@nestjs/common';

import { ORM_PORT, type IHostedRepository, type IOrmPort } from '@acme-libs/contracts/database';
import { Note, NoteRevision } from '@acme-staff/common/entities';

import { NotePersistenceNoteRevisionBuilder } from '../builders/note-persistence-note-revision.builder';
import { NotePersistenceBuilder } from '../builders/note-persistence.builder';

export abstract class NotePersistenceHost {
  protected get noteRepository(): IHostedRepository<Note> {
    return this.orm.getRepository(Note);
  }

  protected get noteRevisionRepository(): IHostedRepository<NoteRevision> {
    return this.orm.getRepository(NoteRevision);
  }

  constructor(
    @Inject(ORM_PORT)
    protected readonly orm: IOrmPort,
  ) {}

  protected createNoteBuilder(): NotePersistenceBuilder {
    return new NotePersistenceBuilder(this.noteRepository.createQueryBuilder(Note.name));
  }

  protected createNoteRevisionBuilder(): NotePersistenceNoteRevisionBuilder {
    return new NotePersistenceNoteRevisionBuilder(
      this.noteRevisionRepository.createQueryBuilder(NoteRevision.name),
    );
  }
}
