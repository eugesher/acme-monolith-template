import type {
  IUserReassignRolesStaffRoleRecord,
  IUserReassignRolesStaffUserRoleDeleteQuery,
  IUserReassignRolesStaffUserRoleInsertQuery,
} from '../interfaces';

export interface IUserReassignRolesRepositoryPort {
  existsUser(id: string): Promise<boolean>;
  findRoles(ids: readonly string[]): Promise<IUserReassignRolesStaffRoleRecord[]>;
  deleteUserRolesExcept(query: IUserReassignRolesStaffUserRoleDeleteQuery): Promise<void>;
  insertUserRolesIgnore(queries: IUserReassignRolesStaffUserRoleInsertQuery[]): Promise<void>;
}

export const USER_REASSIGN_ROLES_REPOSITORY_PORT = Symbol('USER_REASSIGN_ROLES_REPOSITORY_PORT');
