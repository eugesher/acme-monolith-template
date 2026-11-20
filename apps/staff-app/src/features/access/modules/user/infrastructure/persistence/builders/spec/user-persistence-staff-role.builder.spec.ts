import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { StaffRole, StaffRolePermission } from '@acme-staff/common/entities';

import { UserPersistenceStaffRoleBuilder } from '../user-persistence-staff-role.builder';

describe('UserPersistenceStaffRoleBuilder', () => {
  let dataSource: DataSource;
  let baseBuilder: SelectQueryBuilder<StaffRole>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      database: 'acme',
      entities: [StaffRole, StaffRolePermission],
    });
    jest.spyOn(dataSource.driver, 'connect').mockResolvedValue();
    jest.spyOn(dataSource.driver, 'afterConnect').mockResolvedValue();

    await dataSource.initialize();
  });

  beforeEach(() => {
    baseBuilder = dataSource.getRepository(StaffRole).createQueryBuilder(StaffRole.name);
  });

  describe('forByIds', () => {
    it('selects the ids of the roles with the given ids', () => {
      const builder = new UserPersistenceStaffRoleBuilder(baseBuilder).forByIds(['2', '3']);

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `StaffRole`.`id` AS `StaffRole_id` FROM `staff_role` `StaffRole` WHERE `StaffRole`.`id` IN (?, ?)',
        ['2', '3'],
      ]);
    });
  });
});
