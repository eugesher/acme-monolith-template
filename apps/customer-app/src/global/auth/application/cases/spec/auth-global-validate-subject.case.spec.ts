import { AuthGlobalValidateSubjectCase } from '../auth-global-validate-subject.case';
import type {
  IAuthGlobalCredentialsPort,
  IAuthGlobalValidateSubjectRepositoryPort,
} from '../../../outbound';

describe('AuthGlobalValidateSubjectCase', () => {
  let repository: jest.Mocked<IAuthGlobalValidateSubjectRepositoryPort>;
  let credentials: jest.Mocked<IAuthGlobalCredentialsPort>;
  let validateSubjectCase: AuthGlobalValidateSubjectCase;

  beforeEach(() => {
    repository = { findActiveOne: jest.fn() };
    repository.findActiveOne.mockResolvedValue({
      id: 'customer-1',
      email: 'ann@example.com',
    });
    credentials = { verifyAccessToken: jest.fn() };
    credentials.verifyAccessToken.mockResolvedValue('customer-1');
    validateSubjectCase = new AuthGlobalValidateSubjectCase(repository, credentials);
  });

  describe('execute', () => {
    it('returns the id and the email of the active customer the token names', async () => {
      const subject = await validateSubjectCase.execute({ token: 'access-token' });

      expect(subject).toEqual({ id: 'customer-1', email: 'ann@example.com' });
      expect(credentials.verifyAccessToken).toHaveBeenCalledWith('access-token');
      expect(repository.findActiveOne).toHaveBeenCalledWith('customer-1');
    });

    it('returns nothing for a token that does not verify, without reading the customer', async () => {
      credentials.verifyAccessToken.mockResolvedValue(null);

      const subject = await validateSubjectCase.execute({ token: 'access-token' });

      expect(subject).toBeNull();
      expect(repository.findActiveOne).not.toHaveBeenCalled();
    });

    it('returns nothing when no active customer matches', async () => {
      repository.findActiveOne.mockResolvedValue(null);

      const subject = await validateSubjectCase.execute({ token: 'access-token' });

      expect(subject).toBeNull();
    });
  });
});
