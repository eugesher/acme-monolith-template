import { UserStatusEnum } from '@acme-libs/kernel';

import { StaffAuthCoreLoginModel } from '../staff-auth-core-login.model';

describe('StaffAuthCoreLoginModel', () => {
  describe('reconstitute', () => {
    it('keeps the stored state as is', () => {
      const user = StaffAuthCoreLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.DISABLED,
      });

      expect(user).toMatchObject({
        id: 'user-1',
        passwordHash: 'hash',
        status: 'disabled',
      });
    });
  });

  describe('normalizeEmail', () => {
    it('trims and lowercases the address', () => {
      const email = StaffAuthCoreLoginModel.normalizeEmail(' Admin@Example.com ');

      expect(email).toBe('admin@example.com');
    });
  });

  describe('isActive', () => {
    it('answers true for an active user', () => {
      const user = StaffAuthCoreLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(user.isActive()).toBe(true);
    });

    it('answers false for a disabled user', () => {
      const user = StaffAuthCoreLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.DISABLED,
      });

      expect(user.isActive()).toBe(false);
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the user who logged in', () => {
      const user = StaffAuthCoreLoginModel.reconstitute({
        id: 'user-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(user.toLoggerPayload()).toEqual({ id: 'user-1' });
    });
  });
});
