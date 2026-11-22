import { AuthGlobalValidateSubjectUseCase } from '../../application';
import { AuthGlobalFacade } from '../auth-global.facade';

describe('AuthGlobalFacade', () => {
  let repository: jest.Mocked<ConstructorParameters<typeof AuthGlobalValidateSubjectUseCase>[0]>;
  let credentials: jest.Mocked<ConstructorParameters<typeof AuthGlobalValidateSubjectUseCase>[1]>;
  let facade: AuthGlobalFacade;

  beforeEach(() => {
    repository = { findActiveById: jest.fn() };
    credentials = { verifyAccessToken: jest.fn() };
    credentials.verifyAccessToken.mockResolvedValue('customer-1');
    facade = new AuthGlobalFacade(new AuthGlobalValidateSubjectUseCase(repository, credentials));
  });

  describe('handleValidate', () => {
    it('answers the active customer the token names', async () => {
      repository.findActiveById.mockResolvedValue({
        id: 'customer-1',
        email: 'ann@example.com',
      });

      const user = await facade.handleValidate({ token: 'access-token' });

      expect(user).toEqual({ id: 'customer-1', email: 'ann@example.com' });
      expect(credentials.verifyAccessToken).toHaveBeenCalledWith('access-token');
      expect(repository.findActiveById).toHaveBeenCalledWith('customer-1');
    });

    it('answers no user when the subject is not an active customer', async () => {
      repository.findActiveById.mockResolvedValue(null);

      const user = await facade.handleValidate({ token: 'access-token' });

      expect(user).toBeNull();
    });
  });
});
