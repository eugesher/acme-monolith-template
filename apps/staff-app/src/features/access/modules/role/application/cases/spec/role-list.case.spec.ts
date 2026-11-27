import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleListCase } from '../role-list.case';

describe('RoleListCase', () => {
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
    const listCase = new RoleListCase(repository);

    const views = await listCase.execute();

    expect(views).toEqual([
      { id: '1', name: 'admin', permissionCodes: ['access:manage'] },
      { id: '3', name: 'viewer', permissionCodes: [] },
    ]);
  });
});
