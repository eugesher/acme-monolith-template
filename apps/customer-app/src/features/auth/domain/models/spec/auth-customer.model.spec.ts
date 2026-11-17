import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { AuthCustomerModel } from '../auth-customer.model';
import type { IAuthCustomerCandidate } from '../../interfaces';

describe('AuthCustomerModel', () => {
  describe('initCandidate', () => {
    it('initializes an active customer candidate with a normalized email and no id until it is stored', () => {
      const candidate = AuthCustomerModel.initCandidate({
        email: '  Eve@Example.COM ',
        passwordHash: 'hash',
      });

      expect(candidate).toEqual({
        email: 'eve@example.com',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });
    });

    it.each(['eve', 'eve@', '@example.com', 'eve@example', 'e ve@example.com'])(
      'rejects the malformed email %s',
      (email) => {
        const register = (): IAuthCustomerCandidate =>
          AuthCustomerModel.initCandidate({ email, passwordHash: 'hash' });

        expect(register).toThrow(
          expect.objectContaining({
            code: IdentityExceptionCodeEnum.AUTH_EMAIL_INVALID,
            message: 'Customer email must be a well-formed address',
          }) as Error,
        );
      },
    );
  });

  describe('reconstitute', () => {
    it('keeps the stored state as is', () => {
      const customer = AuthCustomerModel.reconstitute({
        id: 'customer-1',
        passwordHash: 'hash',
        status: UserStatusEnum.DISABLED,
      });

      expect(customer).toMatchObject({
        id: 'customer-1',
        passwordHash: 'hash',
        status: 'disabled',
      });
    });
  });

  describe('toRegisterSnapshot', () => {
    it('answers the registered customer under the issued id with the email of the candidate', () => {
      const snapshot = AuthCustomerModel.toRegisterSnapshot('105', {
        email: 'eve@example.com',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(snapshot).toEqual({ id: '105', email: 'eve@example.com' });
    });
  });

  describe('toRegisterLedgerPayload', () => {
    it('answers the registered customer as the subject of the ledger record', () => {
      expect(AuthCustomerModel.toRegisterLedgerPayload('105')).toEqual({ subjectId: '105' });
    });
  });

  describe('toRegisterLoggerPayload', () => {
    it('answers the id of the registered customer', () => {
      expect(AuthCustomerModel.toRegisterLoggerPayload('105')).toEqual({ id: '105' });
    });
  });

  describe('normalizeEmail', () => {
    it('trims the email and lowers its case', () => {
      const email = AuthCustomerModel.normalizeEmail('  Ann@Example.COM ');

      expect(email).toBe('ann@example.com');
    });
  });

  describe('assertPasswordStrength', () => {
    it('accepts a password of 12 characters', () => {
      const assert = (): void => AuthCustomerModel.assertPasswordStrength('123456789012');

      expect(assert).not.toThrow();
    });

    it('rejects a password of 11 characters with AUTH_PASSWORD_TOO_WEAK', () => {
      const assert = (): void => AuthCustomerModel.assertPasswordStrength('12345678901');

      expect(assert).toThrow(
        expect.objectContaining({
          code: IdentityExceptionCodeEnum.AUTH_PASSWORD_TOO_WEAK,
          message: 'Password must be at least 12 characters',
        }) as Error,
      );
    });
  });

  describe('toLoginLoggerPayload', () => {
    it('answers the id of the customer who logged in', () => {
      const customer = AuthCustomerModel.reconstitute({
        id: 'customer-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(customer.toLoginLoggerPayload()).toEqual({ id: 'customer-1' });
    });
  });

  describe('assertActive', () => {
    it('lets an active customer through', () => {
      const customer = AuthCustomerModel.reconstitute({
        id: 'customer-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(() => customer.assertActive()).not.toThrow();
    });

    it('refuses a disabled customer with AUTH_USER_INACTIVE', () => {
      const customer = AuthCustomerModel.reconstitute({
        id: 'customer-1',
        passwordHash: 'hash',
        status: UserStatusEnum.DISABLED,
      });

      expect(() => customer.assertActive()).toThrow(
        expect.objectContaining({
          code: IdentityExceptionCodeEnum.AUTH_USER_INACTIVE,
          message: 'Customer customer-1 is disabled',
        }) as Error,
      );
    });
  });
});
