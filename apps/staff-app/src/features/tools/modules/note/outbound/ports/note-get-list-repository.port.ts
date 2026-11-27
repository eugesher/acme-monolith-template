import type { INoteGetListQuery, INoteGetListRecord } from '../types';

export interface INoteGetListRepositoryPort {
  list(query: INoteGetListQuery): Promise<INoteGetListRecord>;
}

export const NOTE_GET_LIST_REPOSITORY_PORT = Symbol('NOTE_GET_LIST_REPOSITORY_PORT');
