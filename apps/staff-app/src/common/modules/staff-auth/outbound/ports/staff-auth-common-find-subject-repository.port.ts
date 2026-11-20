import type { Nullable } from '@acme-libs/toolkit';

import type { IStaffAuthCommonFindSubjectStaffUserRecord } from '../interfaces';

export interface IStaffAuthCommonFindSubjectRepositoryPort {
  findActiveById(id: string): Promise<Nullable<IStaffAuthCommonFindSubjectStaffUserRecord>>;
}

export const STAFF_AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT = Symbol(
  'STAFF_AUTH_COMMON_FIND_SUBJECT_REPOSITORY_PORT',
);
