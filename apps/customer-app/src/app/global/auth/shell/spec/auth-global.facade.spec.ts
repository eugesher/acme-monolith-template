import { AuthGlobalValidateSubjectUseCase } from '../../application';
import { AuthGlobalFacade } from '../auth-global.facade';

describe('AuthGlobalFacade', () => {
  let repository: jest.Mocked<ConstructorParameters<typeof AuthGlobalValidateSubjectUseCase>[0]>;
  let facade: AuthGlobalFacade;

  beforeEach(() => {
    repository = { findActiveById: jest.fn() };
    facade = new AuthGlobalFacade(new AuthGlobalValidateSubjectUseCase(repository));
  });

  describe('handleValidate', () => {
    it('answers the active customer of the token subject', async () => {
      repository.findActiveById.mockResolvedValue({
        id: 'customer-1',
        email: 'ann@example.com',
      });

      const user = await facade.handleValidate({ sub: 'customer-1' });

      expect(user).toEqual({ id: 'customer-1', email: 'ann@example.com' });
      expect(repository.findActiveById).toHaveBeenCalledWith('customer-1');
    });

    it('answers no user when the subject is not an active customer', async () => {
      repository.findActiveById.mockResolvedValue(null);

      const user = await facade.handleValidate({ sub: 'customer-1' });

      expect(user).toBeNull();
    });
  });
});
