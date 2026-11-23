import type {
  IUserRegisterStaffRoleRecord,
  IUserRegisterStaffUserInsertQuery,
  IUserRegisterStaffUserInsertRecord,
  IUserRegisterStaffUserRoleInsertQuery,
} from '../types';

export interface IUserRegisterRepositoryPort {
  insertUser(query: IUserRegisterStaffUserInsertQuery): Promise<IUserRegisterStaffUserInsertRecord>;
  findRoles(ids: readonly string[]): Promise<IUserRegisterStaffRoleRecord[]>;
  insertUserRoles(queries: IUserRegisterStaffUserRoleInsertQuery[]): Promise<void>;
}

export const USER_REGISTER_REPOSITORY_PORT = Symbol('USER_REGISTER_REPOSITORY_PORT');
