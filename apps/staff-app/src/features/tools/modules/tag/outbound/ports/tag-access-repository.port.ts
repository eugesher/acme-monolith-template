import type { Nullable } from '@acme-libs/toolkit';

import type { ITagAccessRecord } from '../types';

export interface ITagAccessRepositoryPort {
  findOne(tagId: string): Promise<Nullable<ITagAccessRecord>>;
}

export const TAG_ACCESS_REPOSITORY_PORT = Symbol('TAG_ACCESS_REPOSITORY_PORT');
