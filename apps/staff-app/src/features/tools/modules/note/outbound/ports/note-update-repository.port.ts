import type { INoteUpdateAppendRevisionQuery, INoteUpdateQuery } from '../types';

export interface INoteUpdateRepositoryPort {
  update(query: INoteUpdateQuery): Promise<boolean>;
  appendRevision(query: INoteUpdateAppendRevisionQuery): Promise<void>;
}

export const NOTE_UPDATE_REPOSITORY_PORT = Symbol('NOTE_UPDATE_REPOSITORY_PORT');
