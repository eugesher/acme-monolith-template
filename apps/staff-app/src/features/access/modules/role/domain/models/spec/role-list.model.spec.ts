import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleListModel } from '../role-list.model';

describe('RoleListModel', () => {
  describe('toViewData', () => {
    it('answers the snapshot of every listed role with its permission codes sorted', () => {
      const data = RoleListModel.toViewData([
        {
          id: '1',
          name: 'admin',
          rolePermissions: [
            { code: PermissionCodeEnum.LEDGER_READ },
            { code: PermissionCodeEnum.ACCESS_MANAGEMENT },
          ],
        },
      ]);

      expect(data).toEqual([
        { id: '1', name: 'admin', permissionCodes: ['access-management', 'ledger:read'] },
      ]);
    });

    it('answers no snapshots for no records', () => {
      expect(RoleListModel.toViewData([])).toEqual([]);
    });
  });
});
