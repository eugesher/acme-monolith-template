import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthCommonFindSubjectStaffUserRecord } from '../types';

export interface IAuthCommonFindSubjectRepositoryPort {
  findActiveOne(id: string): Promise<Nullable<IAuthCommonFindSubjectStaffUserRecord>>;
}

export const AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT = Symbol(
  'AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT',
);
