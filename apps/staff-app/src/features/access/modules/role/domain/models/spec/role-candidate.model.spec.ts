import { PermissionCodeEnum } from '@acme-libs/kernel';

import { RoleCandidateModel } from '../role-candidate.model';

describe('RoleCandidateModel', () => {
  let candidate: RoleCandidateModel;

  beforeEach(() => {
    candidate = RoleCandidateModel.create({
      name: 'auditor',
      permissionCodes: [PermissionCodeEnum.LEDGER_READ, PermissionCodeEnum.LEDGER_READ],
    });
  });

  describe('toInsertPayload', () => {
    it('answers the role row to insert', () => {
      expect(candidate.toInsertPayload()).toEqual({ name: 'auditor' });
    });
  });

  describe('getRolePermissions', () => {
    it('answers one row of the role per permission code, without duplicates', () => {
      expect(candidate.getRolePermissions('7')).toEqual([{ roleId: '7', code: 'ledger:read' }]);
    });
  });

  describe('toSnapshot', () => {
    it('answers the created role under the issued id', () => {
      expect(candidate.toSnapshot('7')).toEqual({
        id: '7',
        name: 'auditor',
        permissionCodes: ['ledger:read'],
      });
    });
  });

  describe('toLoggerPayload', () => {
    it('answers the id of the created role', () => {
      expect(candidate.toLoggerPayload('7')).toEqual({ id: '7' });
    });
  });
});
