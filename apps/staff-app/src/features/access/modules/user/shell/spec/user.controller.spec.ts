import { UserController } from '../user.controller';
import type { UserReassignRolesUseCase, UserRegisterUseCase } from '../../application';

describe('UserController', () => {
  let register: jest.Mocked<Pick<UserRegisterUseCase, 'execute'>>;
  let reassignRoles: jest.Mocked<Pick<UserReassignRolesUseCase, 'execute'>>;
  let controller: UserController;

  beforeEach(() => {
    register = { execute: jest.fn() };
    reassignRoles = { execute: jest.fn() };

    controller = new UserController(
      register as unknown as UserRegisterUseCase,
      reassignRoles as unknown as UserReassignRolesUseCase,
    );
  });

  describe('handleRegister', () => {
    it('answers the registered user', async () => {
      register.execute.mockResolvedValue({ id: 'user-1', email: 'ann@example.com' });

      const response = await controller.handleRegister({
        email: 'ann@example.com',
        password: 'long-enough-password',
        roleIds: ['2'],
      });

      expect(response).toEqual({ id: 'user-1', email: 'ann@example.com' });
    });
  });

  describe('handleReassignRoles', () => {
    it('reassigns the roles of the user of the path with the ids of the body', async () => {
      reassignRoles.execute.mockResolvedValue({ id: '4', roleIds: ['3'] });

      const response = await controller.handleReassignRoles({ userId: '4' }, { roleIds: ['3'] });

      expect(response).toEqual({ id: '4', roleIds: ['3'] });
      expect(reassignRoles.execute).toHaveBeenCalledWith({ userId: '4', roleIds: ['3'] });
    });
  });
});
