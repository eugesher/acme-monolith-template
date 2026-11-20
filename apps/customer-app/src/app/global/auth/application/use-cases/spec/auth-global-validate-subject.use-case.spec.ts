import { AuthGlobalValidateSubjectUseCase } from '../auth-global-validate-subject.use-case';
import type { IAuthGlobalValidateSubjectRepositoryPort } from '../../../outbound';

describe('AuthGlobalValidateSubjectUseCase', () => {
  let repository: jest.Mocked<IAuthGlobalValidateSubjectRepositoryPort>;
  let useCase: AuthGlobalValidateSubjectUseCase;

  beforeEach(() => {
    repository = { findActiveById: jest.fn() };
    repository.findActiveById.mockResolvedValue({
      id: 'customer-1',
      email: 'ann@example.com',
    });
    useCase = new AuthGlobalValidateSubjectUseCase(repository);
  });

  describe('execute', () => {
    it('returns the id and the email of an active customer', async () => {
      const subject = await useCase.execute({ customerId: 'customer-1' });

      expect(subject).toEqual({ id: 'customer-1', email: 'ann@example.com' });
      expect(repository.findActiveById).toHaveBeenCalledWith('customer-1');
    });

    it('returns nothing when no active customer matches', async () => {
      repository.findActiveById.mockResolvedValue(null);

      const subject = await useCase.execute({ customerId: 'ghost' });

      expect(subject).toBeNull();
    });
  });
});
