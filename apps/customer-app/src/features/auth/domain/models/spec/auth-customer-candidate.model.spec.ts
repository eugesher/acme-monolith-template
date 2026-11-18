import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { AuthCustomerCandidateModel } from '../auth-customer-candidate.model';

describe('AuthCustomerCandidateModel', () => {
  describe('assertPasswordStrength', () => {
    it('accepts a password of 12 characters', () => {
      const assert = (): void => AuthCustomerCandidateModel.assertPasswordStrength('123456789012');

      expect(assert).not.toThrow();
    });

    it('rejects a password of 11 characters with AUTH_PASSWORD_TOO_WEAK', () => {
      const assert = (): void => AuthCustomerCandidateModel.assertPasswordStrength('12345678901');

      expect(assert).toThrow(
        expect.objectContaining({
          code: IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
          message: 'Password must be at least 12 characters',
        }) as Error,
      );
    });
  });

  describe('create', () => {
    it('holds the email trimmed and lowered in case', () => {
      const candidate = AuthCustomerCandidateModel.create({
        email: '  Eve@Example.COM ',
        passwordHash: 'hash',
      });

      expect(candidate.toInsertPayload()).toMatchObject({ email: 'eve@example.com' });
    });
  });

  describe('assertEmail', () => {
    it('accepts a well-formed email', () => {
      const candidate = AuthCustomerCandidateModel.create({
        email: 'eve@example.com',
        passwordHash: 'hash',
      });

      expect(() => candidate.assertEmail()).not.toThrow();
    });

    it('rejects a malformed email with AUTH_EMAIL_INVALID', () => {
      const candidate = AuthCustomerCandidateModel.create({ email: 'eve@', passwordHash: 'hash' });

      expect(() => candidate.assertEmail()).toThrow(
        expect.objectContaining({ code: IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID }) as Error,
      );
    });
  });

  describe('toInsertPayload', () => {
    it('answers an active customer row with no id until it is stored', () => {
      const candidate = AuthCustomerCandidateModel.create({
        email: 'eve@example.com',
        passwordHash: 'hash',
      });

      expect(candidate.toInsertPayload()).toEqual({
        email: 'eve@example.com',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });
    });
  });

  describe('toRegistered', () => {
    it('answers the stored customer under the issued id with the email of the candidate', () => {
      const candidate = AuthCustomerCandidateModel.create({
        email: 'eve@example.com',
        passwordHash: 'hash',
      });

      expect(candidate.toRegistered('105')).toEqual({
        id: '105',
        email: 'eve@example.com',
      });
    });
  });
});
