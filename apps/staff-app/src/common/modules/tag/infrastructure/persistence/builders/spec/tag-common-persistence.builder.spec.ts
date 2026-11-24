import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { Tag, TagSubject } from '@acme-staff/common/entities';

import { TagCommonPersistenceBuilder } from '../tag-common-persistence.builder';

describe('TagCommonPersistenceBuilder', () => {
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

  describe('forList', () => {
    it('selects the tags of the subject by name', () => {
      const builder = new TagCommonPersistenceBuilder(baseBuilder).forList({
        subjectType: 'product',
        subjectId: '100',
      });

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Tag`.`id` AS `Tag_id`, `Tag`.`name` AS `Tag_name` FROM `tag` `Tag` INNER JOIN `tag_subject` `TagSubject` ON `TagSubject`.`tagId` = `Tag`.`id` WHERE `TagSubject`.`subjectType` = ? AND `TagSubject`.`subjectId` = ? ORDER BY `Tag_name` ASC',
        ['product', '100'],
      ]);
    });
  });

  describe('forLockTags', () => {
    it('selects the given tags by name under a shared lock', () => {
      const builder = new TagCommonPersistenceBuilder(baseBuilder).forLockTags(['300', '301']);

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `Tag`.`id` AS `Tag_id`, `Tag`.`name` AS `Tag_name` FROM `tag` `Tag` WHERE `Tag`.`id` IN (?, ?) ORDER BY `Tag_name` ASC LOCK IN SHARE MODE',
        ['300', '301'],
      ]);
    });
  });
});
