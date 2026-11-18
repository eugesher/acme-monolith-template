import { IdentityExceptionCodeEnum, UserStatusEnum } from '@acme-libs/kernel';

import { AuthCustomerLoginModel } from '../auth-customer-login.model';

describe('AuthCustomerLoginModel', () => {
  describe('reconstitute', () => {
    it('keeps the stored state as is', () => {
      const customer = AuthCustomerLoginModel.reconstitute({
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

  describe('toLoggerPayload', () => {
    it('answers the id of the customer who logged in', () => {
      const customer = AuthCustomerLoginModel.reconstitute({
        id: 'customer-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(customer.toLoggerPayload()).toEqual({ id: 'customer-1' });
    });
  });

  describe('assertActive', () => {
    it('lets an active customer through', () => {
      const customer = AuthCustomerLoginModel.reconstitute({
        id: 'customer-1',
        passwordHash: 'hash',
        status: UserStatusEnum.ACTIVE,
      });

      expect(() => customer.assertActive()).not.toThrow();
    });

    it('refuses a disabled customer with AUTH_USER_INACTIVE', () => {
      const customer = AuthCustomerLoginModel.reconstitute({
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
