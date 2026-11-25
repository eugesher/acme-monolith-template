import type { INoteGetRevisionsListQuery, INoteGetRevisionsRecord } from '../types';

export interface INoteGetRevisionsRepositoryPort {
  list(query: INoteGetRevisionsListQuery): Promise<INoteGetRevisionsRecord>;
}

export const NOTE_GET_REVISIONS_REPOSITORY_PORT = Symbol('NOTE_GET_REVISIONS_REPOSITORY_PORT');
