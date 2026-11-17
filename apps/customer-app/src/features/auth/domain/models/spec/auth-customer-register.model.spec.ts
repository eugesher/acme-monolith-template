import { AuthCustomerRegisterModel } from '../auth-customer-register.model';

describe('AuthCustomerRegisterModel', () => {
  describe('toSnapshot', () => {
    it('answers the registered customer with its id and email', () => {
      const customer = AuthCustomerRegisterModel.reconstitute({
        id: '105',
        email: 'eve@example.com',
      });

      expect(customer.toSnapshot()).toEqual({ id: '105', email: 'eve@example.com' });
    });
  });

  describe('toLedgerPayload', () => {
    it('answers the registered customer as the subject of the ledger record', () => {
      const customer = AuthCustomerRegisterModel.reconstitute({
        id: '105',
        email: 'eve@example.com',
      });

      expect(customer.toLedgerPayload()).toEqual({ subjectId: '105' });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the registered customer', () => {
      const customer = AuthCustomerRegisterModel.reconstitute({
        id: '105',
        email: 'eve@example.com',
      });

      expect(customer.toLoggerPayload()).toEqual({ id: '105' });
    });
  });
});
