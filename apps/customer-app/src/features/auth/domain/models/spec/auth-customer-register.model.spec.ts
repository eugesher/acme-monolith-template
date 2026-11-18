import { AuthCustomerRegisterModel } from '../auth-customer-register.model';

describe('AuthCustomerRegisterModel', () => {
  describe('toSnapshot', () => {
    it('answers the registered customer with its id and email', () => {
      const customer = AuthCustomerRegisterModel.reconstitute({
        id: '105',
        email: 'eve@example.com',
        createdAt: new Date('2026-01-05T08:00:00.000Z'),
      });

      expect(customer.toSnapshot()).toEqual({ id: '105', email: 'eve@example.com' });
    });
  });

  describe('toLedgerPayload', () => {
    it('answers the registered customer as the subject of the ledger record at its creation', () => {
      const customer = AuthCustomerRegisterModel.reconstitute({
        id: '105',
        email: 'eve@example.com',
        createdAt: new Date('2026-01-05T08:00:00.000Z'),
      });

      expect(customer.toLedgerPayload()).toEqual({
        subjectId: '105',
        occurredAt: '2026-01-05T08:00:00.000Z',
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the registered customer', () => {
      const customer = AuthCustomerRegisterModel.reconstitute({
        id: '105',
        email: 'eve@example.com',
        createdAt: new Date('2026-01-05T08:00:00.000Z'),
      });

      expect(customer.toLoggerPayload()).toEqual({ id: '105' });
    });
  });
});
