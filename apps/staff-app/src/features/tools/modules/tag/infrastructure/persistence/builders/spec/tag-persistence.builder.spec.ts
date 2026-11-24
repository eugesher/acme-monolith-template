import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { Tag, TagSubject } from '@acme-staff/common/entities';

import { TagPersistenceBuilder } from '../tag-persistence.builder';

describe('TagPersistenceBuilder', () => {
  let dataSource: DataSource;
  let baseBuilder: SelectQueryBuilder<Tag>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'mysql',
      database: 'acme',
      entities: [Tag, TagSubject],
    });
    jest.spyOn(dataSource.driver, 'connect').mockResolvedValue();
    jest.spyOn(dataSource.driver, 'afterConnect').mockResolvedValue();

    await dataSource.initialize();
  });

  beforeEach(() => {
    baseBuilder = dataSource.getRepository(Tag).createQueryBuilder(Tag.name);
  });

  describe('forById', () => {
    it('selects the tag by id', () => {
      const builder = new TagPersistenceBuilder(baseBuilder).forById('300');

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Tag`.`id` AS `Tag_id`, `Tag`.`name` AS `Tag_name`, `Tag`.`createdAt` AS `Tag_createdAt`, `Tag`.`updatedAt` AS `Tag_updatedAt` FROM `tag` `Tag` WHERE `Tag`.`id` = ?',
        ['300'],
      ]);
    });
  });

  describe('forList', () => {
    it('selects every tag by name inside the page window', () => {
      const builder = new TagPersistenceBuilder(baseBuilder).forList({ limit: 20, offset: 40 });

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Tag`.`id` AS `Tag_id`, `Tag`.`name` AS `Tag_name`, `Tag`.`createdAt` AS `Tag_createdAt`, `Tag`.`updatedAt` AS `Tag_updatedAt` FROM `tag` `Tag` ORDER BY `Tag_name` ASC, `Tag_id` ASC LIMIT 20 OFFSET 40',
        [],
      ]);
    });
  });
});
