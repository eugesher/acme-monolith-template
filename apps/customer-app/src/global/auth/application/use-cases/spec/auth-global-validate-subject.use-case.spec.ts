import { AuthGlobalValidateSubjectUseCase } from '../auth-global-validate-subject.use-case';
import type {
  IAuthGlobalCredentialsPort,
  IAuthGlobalValidateSubjectRepositoryPort,
} from '../../../outbound';

describe('AuthGlobalValidateSubjectUseCase', () => {
  let repository: jest.Mocked<IAuthGlobalValidateSubjectRepositoryPort>;
  let credentials: jest.Mocked<IAuthGlobalCredentialsPort>;
  let useCase: AuthGlobalValidateSubjectUseCase;

  beforeEach(() => {
    repository = { findActiveById: jest.fn() };
    repository.findActiveById.mockResolvedValue({
      id: 'customer-1',
      email: 'ann@example.com',
    });
    credentials = { verifyAccessToken: jest.fn() };
    credentials.verifyAccessToken.mockResolvedValue('customer-1');
    useCase = new AuthGlobalValidateSubjectUseCase(repository, credentials);
  });

  describe('execute', () => {
    it('returns the id and the email of the active customer the token names', async () => {
      const subject = await useCase.execute({ token: 'access-token' });

      expect(subject).toEqual({ id: 'customer-1', email: 'ann@example.com' });
      expect(credentials.verifyAccessToken).toHaveBeenCalledWith('access-token');
      expect(repository.findActiveById).toHaveBeenCalledWith('customer-1');
    });

    it('returns nothing for a token that does not verify, without reading the customer', async () => {
      credentials.verifyAccessToken.mockResolvedValue(null);

      const subject = await useCase.execute({ token: 'access-token' });

      expect(subject).toBeNull();
      expect(repository.findActiveById).not.toHaveBeenCalled();
    });

    it('returns nothing when no active customer matches', async () => {
      repository.findActiveById.mockResolvedValue(null);

      const subject = await useCase.execute({ token: 'access-token' });

      expect(subject).toBeNull();
    });
  });
});
