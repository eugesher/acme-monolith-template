import { DataSource, type SelectQueryBuilder } from 'typeorm';

import { Tag, TagSubject } from '@acme-staff/common/entities';

import { TagCommonPersistenceTagSubjectBuilder } from '../tag-common-persistence-tag-subject.builder';

describe('TagCommonPersistenceTagSubjectBuilder', () => {
  let dataSource: DataSource;
  let baseBuilder: SelectQueryBuilder<TagSubject>;

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
    baseBuilder = dataSource.getRepository(TagSubject).createQueryBuilder(TagSubject.name);
  });

  describe('forTag', () => {
    it('selects the subjects of the type that carry the tag', () => {
      const builder = new TagCommonPersistenceTagSubjectBuilder(baseBuilder).forTag({
        subjectType: 'product',
        tagId: '300',
      });

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `TagSubject`.`tagId` AS `TagSubject_tagId`, `TagSubject`.`subjectType` AS `TagSubject_subjectType`, `TagSubject`.`subjectId` AS `TagSubject_subjectId` FROM `tag_subject` `TagSubject` WHERE `TagSubject`.`tagId` = ? AND `TagSubject`.`subjectType` = ?',
        ['300', 'product'],
      ]);
    });
  });

  describe('forLinked', () => {
    it('selects the tag links of the subject', () => {
      const builder = new TagCommonPersistenceTagSubjectBuilder(baseBuilder).forLinked({
        subjectType: 'product',
        subjectId: '100',
      });

      expect(builder.getQueryAndParameters()).toEqual([
        'SELECT `TagSubject`.`tagId` AS `TagSubject_tagId`, `TagSubject`.`subjectType` AS `TagSubject_subjectType`, `TagSubject`.`subjectId` AS `TagSubject_subjectId` FROM `tag_subject` `TagSubject` WHERE `TagSubject`.`subjectType` = ? AND `TagSubject`.`subjectId` = ?',
        ['product', '100'],
      ]);
    });
  });
});
