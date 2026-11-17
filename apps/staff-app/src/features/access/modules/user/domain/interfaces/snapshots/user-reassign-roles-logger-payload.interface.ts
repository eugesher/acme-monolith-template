export interface IUserReassignRolesLoggerPayload {
  readonly id: string;
  readonly userRoles: { readonly roleId: string }[];
}
