import { DataSource, type SelectQueryBuilder } from 'typeorm';

import {
  StaffRole,
  StaffRolePermission,
  StaffUser,
  StaffUserRole,
} from '@acme-staff/common/entities';

import { AuthCommonPersistenceStaffUserBuilder } from '../auth-common-persistence-staff-user.builder';

describe('AuthCommonPersistenceStaffUserBuilder', () => {
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

  describe('forActiveOne', () => {
    it('selects the active user with its roles and permission codes', () => {
      const builder = new AuthCommonPersistenceStaffUserBuilder(baseBuilder).forActiveOne('1');

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `StaffUser`.`id` AS `StaffUser_id`, `StaffUser`.`email` AS `StaffUser_email`, `StaffUserRole`.`userId` AS `StaffUserRole_userId`, `StaffUserRole`.`roleId` AS `StaffUserRole_roleId`, `StaffRole`.`id` AS `StaffRole_id`, `StaffRole`.`name` AS `StaffRole_name`, `StaffRolePermission`.`roleId` AS `StaffRolePermission_roleId`, `StaffRolePermission`.`code` AS `StaffRolePermission_code` FROM `staff_user` `StaffUser` LEFT JOIN `staff_user_roles` `StaffUserRole` ON `StaffUserRole`.`user_id`=`StaffUser`.`id` LEFT JOIN `staff_role` `StaffRole` ON `StaffRole`.`id`=`StaffUserRole`.`role_id` LEFT JOIN `staff_role_permissions` `StaffRolePermission` ON `StaffRolePermission`.`role_id`=`StaffRole`.`id` WHERE `StaffUser`.`id` = ? AND `StaffUser`.`status` = ?',
        ['1', 'active'],
      ]);
    });
  });
});
