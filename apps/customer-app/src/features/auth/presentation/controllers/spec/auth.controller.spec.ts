import { AuthController } from '../auth.controller';
import type { AuthLoginUseCase, AuthRegisterUseCase } from '../../../application';

describe('AuthController', () => {
  let register: jest.Mocked<Pick<AuthRegisterUseCase, 'execute'>>;
  let login: jest.Mocked<Pick<AuthLoginUseCase, 'execute'>>;
  let controller: AuthController;

  beforeEach(() => {
    register = { execute: jest.fn() };
    login = { execute: jest.fn() };
    controller = new AuthController(
      register as unknown as AuthRegisterUseCase,
      login as unknown as AuthLoginUseCase,
    );
  });

  describe('handleRegister', () => {
    it('answers the customer the register use case created', async () => {
      register.execute.mockResolvedValue({ id: 'customer-1', email: 'eve@example.com' });

      const response = await controller.handleRegister({
        email: 'eve@example.com',
        password: 'long-enough-password',
      });

      expect(response).toEqual({ id: 'customer-1', email: 'eve@example.com' });
      expect(register.execute).toHaveBeenCalledWith({
        email: 'eve@example.com',
        password: 'long-enough-password',
      });
    });
  });

  describe('handleLogin', () => {
    it('answers the access token of the login use case', async () => {
      login.execute.mockResolvedValue({ accessToken: 'access-1' });

      const response = await controller.handleLogin({
        email: 'ann@example.com',
        password: 'secret',
      });

      expect(response).toEqual({ accessToken: 'access-1' });
      expect(login.execute).toHaveBeenCalledWith({ email: 'ann@example.com', password: 'secret' });
    });
  });

  describe('handleMe', () => {
    it('answers the current user exactly as the guards resolved it', () => {
      const response = controller.handleMe({ id: 'customer-1', email: 'ann@example.com' });

      expect(response).toEqual({ id: 'customer-1', email: 'ann@example.com' });
    });
  });
});
