import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleGetManyModel } from '../role-get-many.model';

describe('RoleGetManyModel', () => {
  describe('toViewData', () => {
    it('answers the snapshot of every listed role with its permission codes sorted', () => {
      const data = RoleGetManyModel.toViewData([
        {
          id: '1',
          name: 'admin',
          rolePermissions: [
            { code: PermissionCodeEnum.LEDGER_READ },
            { code: PermissionCodeEnum.ACCESS_MANAGE },
          ],
        },
      ]);

      expect(data).toEqual([
        { id: '1', name: 'admin', permissionCodes: ['access:manage', 'ledger:read'] },
      ]);
    });

    it('answers no snapshots for no records', () => {
      expect(RoleGetManyModel.toViewData([])).toEqual([]);
    });
  });
});
