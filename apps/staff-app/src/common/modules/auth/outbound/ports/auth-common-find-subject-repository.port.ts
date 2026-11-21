import type { Nullable } from '@acme-libs/toolkit';

import type { IAuthCommonFindSubjectStaffUserRecord } from '../interfaces';

export interface IAuthCommonFindSubjectRepositoryPort {
  findActiveById(id: string): Promise<Nullable<IAuthCommonFindSubjectStaffUserRecord>>;
}

export const AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT = Symbol(
  'AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT',
);
