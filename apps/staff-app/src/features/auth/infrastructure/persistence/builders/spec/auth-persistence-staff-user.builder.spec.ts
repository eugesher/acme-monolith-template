import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { StaffRole, StaffRolePermission, StaffUser, StaffUserRole } from '@acme-core/entities';

import { AuthPersistenceStaffUserBuilder } from '../auth-persistence-staff-user.builder';

describe('AuthPersistenceStaffUserBuilder', () => {
  let dataSource: DataSource;
  let baseBuilder: SelectQueryBuilder<StaffUser>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      database: 'acme',
      entities: [StaffRole, StaffRolePermission, StaffUser, StaffUserRole],
    });
    jest.spyOn(dataSource.driver, 'connect').mockResolvedValue();
    jest.spyOn(dataSource.driver, 'afterConnect').mockResolvedValue();

    await dataSource.initialize();
  });

  beforeEach(() => {
    baseBuilder = dataSource.getRepository(StaffUser).createQueryBuilder(StaffUser.name);
  });

  describe('forByEmail', () => {
    it('selects the credentials and status of the user with the email', () => {
      const builder = new AuthPersistenceStaffUserBuilder(baseBuilder).forByEmail(
        'admin@example.com',
      );

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `StaffUser`.`id` AS `StaffUser_id`, `StaffUser`.`passwordHash` AS `StaffUser_passwordHash`, `StaffUser`.`status` AS `StaffUser_status` FROM `staff_user` `StaffUser` WHERE `StaffUser`.`email` = ?',
        ['admin@example.com'],
      ]);
    });
  });
});
