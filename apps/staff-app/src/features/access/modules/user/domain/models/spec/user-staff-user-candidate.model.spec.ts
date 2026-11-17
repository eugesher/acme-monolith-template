import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { UserStaffUserCandidateModel } from '../user-staff-user-candidate.model';

describe('UserStaffUserCandidateModel', () => {
  let candidate: UserStaffUserCandidateModel;

  beforeEach(() => {
    candidate = UserStaffUserCandidateModel.create({
      email: '  Editor@Example.COM ',
      passwordHash: 'hash',
      roleIds: ['2', '2', '3'],
    });
  });

  describe('create', () => {
    it.each(['editor', 'editor@', '@example.com', 'editor@example', 'ed itor@example.com'])(
      'rejects the malformed email %s',
      (email) => {
        const create = (): UserStaffUserCandidateModel =>
          UserStaffUserCandidateModel.create({ email, passwordHash: 'hash', roleIds: [] });

        expect(create).toThrow(
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
      const assert = (): void => UserStaffUserCandidateModel.assertPasswordStrength('123456789012');

      expect(assert).not.toThrow();
    });

    it('rejects a password of 11 characters', () => {
      const assert = (): void => UserStaffUserCandidateModel.assertPasswordStrength('12345678901');

      expect(assert).toThrow(
        expect.objectContaining({
          code: IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
          message: 'Password must be at least 12 characters',
        }) as Error,
      );
    });
  });

  describe('distinctRoleIds', () => {
    it('answers every requested role once', () => {
      expect(candidate.distinctRoleIds).toEqual(['2', '3']);
    });
  });

  describe('toInsertQuery', () => {
    it('answers an active user row with the normalized email', () => {
      expect(candidate.toInsertQuery()).toEqual({
        email: 'editor@example.com',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });
    });
  });

  describe('assertRoles', () => {
    it('refuses a role that is not stored with AUTH_ROLE_NOT_FOUND', () => {
      expect(() => candidate.assertRoles([{ id: '2' }])).toThrow(
        expect.objectContaining({ code: IdentityExceptionCodeEnum.AUTH_ROLE_NOT_FOUND }) as Error,
      );
    });

    it('accepts roles that are all stored', () => {
      expect(() => candidate.assertRoles([{ id: '3' }, { id: '2' }])).not.toThrow();
    });
  });

  describe('getUserRoles', () => {
    it('answers one row of the user per distinct role', () => {
      expect(candidate.getUserRoles('5')).toEqual([
        { userId: '5', roleId: '2' },
        { userId: '5', roleId: '3' },
      ]);
    });
  });

  describe('toSnapshot', () => {
    it('answers the registered user under the issued id with the normalized email', () => {
      expect(candidate.toSnapshot('5')).toEqual({ id: '5', email: 'editor@example.com' });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the registered user', () => {
      expect(candidate.toLoggerPayload('5')).toEqual({ id: '5' });
    });
  });
});
