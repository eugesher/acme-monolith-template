import { PermissionCodeEnum } from '@acme-libs/kernel';

import { PermissionGetManyCase } from '../permission-get-many.case';

describe('PermissionGetManyCase', () => {
  it('answers every code of the enum', () => {
    const view = new PermissionGetManyCase().execute();

    expect(view.codes).toEqual(Object.values(PermissionCodeEnum));
    expect(view.codes).toContain('access:manage');
  });
});
