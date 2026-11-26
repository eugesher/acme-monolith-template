import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { AuthStaffUserLoginModel } from '../auth-staff-user-login.model';

describe('AuthStaffUserLoginModel', () => {
  describe('reconstitute', () => {
    it('keeps the stored id and password hash as they are', () => {
      const user = AuthStaffUserLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(user).toMatchObject({ id: 'user-1', passwordHash: 'hash' });
    });
  });

  describe('assertActive', () => {
    it('passes an active user', () => {
      const user = AuthStaffUserLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(() => user.assertActive()).not.toThrow();
    });

    it('refuses a disabled user with its id', () => {
      const user = AuthStaffUserLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.DISABLED,
      });

      expect(() => user.assertActive()).toThrow(
        expect.objectContaining({
          code: IdentityExceptionCodeEnum.AUTH_USER_INACTIVE,
          message: 'User user-1 is disabled',
        }) as Error,
      );
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the user who logged in', () => {
      const user = AuthStaffUserLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(user.toLoggerPayload()).toEqual({ id: 'user-1' });
    });
  });
});
