import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { UserStaffUserModel } from '../user-staff-user.model';
import type { IUserStaffUserCandidate } from '../../interfaces';

describe('UserStaffUserModel', () => {
  describe('initCandidate', () => {
    it('initializes an active user candidate with a normalized email, unique roles and no id until it is stored', () => {
      const candidate = UserStaffUserModel.initCandidate({
        email: '  Editor@Example.COM ',
        passwordHash: 'hash',
        roleIds: ['2', '2', '3'],
      });

      expect(candidate).toEqual({
        email: 'editor@example.com',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
        roleIds: ['2', '3'],
      });
    });

    it.each(['editor', 'editor@', '@example.com', 'editor@example', 'ed itor@example.com'])(
      'rejects the malformed email %s',
      (email) => {
        const register = (): IUserStaffUserCandidate =>
          UserStaffUserModel.initCandidate({ email, passwordHash: 'hash', roleIds: [] });

        expect(register).toThrow(
          expect.objectContaining({
            code: IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID,
            message: 'User email must be a well-formed address',
          }) as Error,
        );
      },
    );
  });

  describe('assertPasswordStrength', () => {
    it('accepts a password of 12 characters', () => {
      const assert = (): void => UserStaffUserModel.assertPasswordStrength('123456789012');

      expect(assert).not.toThrow();
    });

    it('rejects a password of 11 characters', () => {
      const assert = (): void => UserStaffUserModel.assertPasswordStrength('12345678901');

      expect(assert).toThrow(
        expect.objectContaining({
          code: IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
          message: 'Password must be at least 12 characters',
        }) as Error,
      );
    });
  });
});
