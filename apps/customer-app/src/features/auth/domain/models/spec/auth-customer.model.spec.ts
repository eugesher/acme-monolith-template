import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { AuthCustomerModel } from '../auth-customer.model';

describe('AuthCustomerModel', () => {
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

  describe('normalizeEmail', () => {
    it('trims the email and lowers its case', () => {
      const email = AuthCustomerModel.normalizeEmail('  Ann@Example.COM ');

      expect(email).toBe('ann@example.com');
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
