import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleListUseCase } from '../role-list.use-case';

describe('RoleListUseCase', () => {
  it('returns every role with its permission codes', async () => {
    const repository = {
      list: jest.fn().mockResolvedValue([
        {
          id: '1',
          name: 'admin',
          rolePermissions: [{ code: PermissionCodeEnum.ACCESS_MANAGE }],
        },
        {
          id: '3',
          name: 'viewer',
          rolePermissions: [],
        },
      ]),
    };
    const useCase = new RoleListUseCase(repository);

    const views = await useCase.execute();

    expect(views).toEqual([
      { id: '1', name: 'admin', permissionCodes: ['access:manage'] },
      { id: '3', name: 'viewer', permissionCodes: [] },
    ]);
  });
});
