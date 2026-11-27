import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleGetManyCase } from '../role-get-many.case';

describe('RoleGetManyCase', () => {
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
    const getManyCase = new RoleGetManyCase(repository);

    const views = await getManyCase.execute();

    expect(views).toEqual([
      { id: '1', name: 'admin', permissionCodes: ['access:manage'] },
      { id: '3', name: 'viewer', permissionCodes: [] },
    ]);
  });
});
