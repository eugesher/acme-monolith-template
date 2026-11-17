import { IdentityExceptionCodeEnum } from '@acme-libs/kernel';

import { UserStaffUserRolesModel } from '../user-staff-user-roles.model';

describe('UserStaffUserRolesModel', () => {
  let userRoles: UserStaffUserRolesModel;

  beforeEach(() => {
    userRoles = UserStaffUserRolesModel.create({ userId: 'user-1', roleIds: ['2', '3'] });
  });

  describe('assertRoles', () => {
    it('refuses a role that is not stored with AUTH_ROLE_NOT_FOUND', () => {
      expect(() => userRoles.assertRoles([{ id: '2' }])).toThrow(
        expect.objectContaining({ code: IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND }) as Error,
      );
    });

    it('accepts roles that are all stored', () => {
      expect(() => userRoles.assertRoles([{ id: '3' }, { id: '2' }])).not.toThrow();
    });
  });

  describe('getUserRoles', () => {
    it('answers one row of the user per role', () => {
      expect(userRoles.getUserRoles()).toEqual([
        { userId: 'user-1', roleId: '2' },
        { userId: 'user-1', roleId: '3' },
      ]);
    });
  });

  describe('toSnapshot', () => {
    it('answers the user with the reassigned roles', () => {
      expect(userRoles.toSnapshot()).toEqual({ id: 'user-1', roleIds: ['2', '3'] });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the user and the roles it holds', () => {
      expect(userRoles.toLoggerPayload()).toEqual({
        id: 'user-1',
        userRoles: [{ roleId: '2' }, { roleId: '3' }],
      });
    });
  });
});
