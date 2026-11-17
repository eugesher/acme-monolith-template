import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleCreateModel } from '../role-create.model';

describe('RoleCreateModel', () => {
  let role: RoleCreateModel;

  beforeEach(() => {
    role = RoleCreateModel.reconstitute({
      id: '7',
      name: 'auditor',
      permissionCodes: [PermissionCodeEnum.LEDGER_READ],
    });
  });

  describe('toSnapshot', () => {
    it('answers the created role with its name and permission codes', () => {
      expect(role.toSnapshot()).toEqual({
        id: '7',
        name: 'auditor',
        permissionCodes: ['ledger:read'],
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the created role', () => {
      expect(role.toLoggerPayload()).toEqual({ id: '7' });
    });
  });
});
