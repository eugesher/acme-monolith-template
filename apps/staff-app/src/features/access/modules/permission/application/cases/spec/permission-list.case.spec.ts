import { PermissionCodeEnum } from '@acme-libs/kernel';

import { PermissionListCase } from '../permission-list.case';

describe('PermissionListCase', () => {
  it('answers every code of the enum', () => {
    const view = new PermissionListCase().execute();

    expect(view.codes).toEqual(Object.values(PermissionCodeEnum));
    expect(view.codes).toContain('access:manage');
  });
});
