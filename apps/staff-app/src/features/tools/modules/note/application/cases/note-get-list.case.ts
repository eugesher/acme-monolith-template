import { Inject, Injectable } from '@nestjs/common';

import { PaginationHelper } from '@acme-libs/toolkit';

import { NoteGetListModel, NoteSubjectInvalidException } from '../../domain';
import { NOTE_GET_LIST_REPOSITORY_PORT, type INoteGetListRepositoryPort } from '../../outbound';
import type { INoteGetListCommand, INoteGetListView } from '../types';

@Injectable()
export class NoteGetListCase {
  constructor(
    @Inject(NOTE_GET_LIST_REPOSITORY_PORT)
    private readonly repository: INoteGetListRepositoryPort,
  ) {}

  public async execute(command: INoteGetListCommand): Promise<INoteGetListView> {
    const { subjectType, subjectId, resolved, authorId } = command;

    if ((subjectType === undefined) !== (subjectId === undefined)) {
      throw new NoteSubjectInvalidException();
    }

    const { limit, offset, page } = PaginationHelper.clampPageWindow({ query: command });
    const [records, total] = await this.repository.list({
      limit,
      offset,
      subjectType,
      subjectId,
      resolved,
      authorId,
    });
    const data = NoteGetListModel.toViewData(records);

    return PaginationHelper.toPage({ data, page, limit, total });
  }
}
