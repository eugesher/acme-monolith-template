import type {
  IUserReassignRolesStaffRoleRecord,
  IUserReassignRolesStaffUserRoleDeleteQuery,
  IUserReassignRolesStaffUserRoleInsertQuery,
} from '../types';

export interface IUserReassignRolesRepositoryPort {
  existsUser(id: string): Promise<boolean>;
  findMany(ids: readonly string[]): Promise<IUserReassignRolesStaffRoleRecord[]>;
  deleteUserRolesExcept(query: IUserReassignRolesStaffUserRoleDeleteQuery): Promise<void>;
  insertUserRolesIgnore(queries: IUserReassignRolesStaffUserRoleInsertQuery[]): Promise<void>;
}

export const USER_REASSIGN_ROLES_REPOSITORY_PORT = Symbol('USER_REASSIGN_ROLES_REPOSITORY_PORT');
