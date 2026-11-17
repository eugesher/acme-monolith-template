import { TagCommonSubjectTagsModel } from '../tag-common-subject-tags.model';

describe('TagCommonSubjectTagsModel', () => {
  describe('missingTagIds', () => {
    it('answers the requested ids that were not found, once each', () => {
      const missing = TagCommonSubjectTagsModel.missingTagIds(
        ['1', '2', '3', '3'],
        [{ id: '2', name: 'vip' }],
      );

      expect(missing).toEqual(['1', '3']);
    });

    it('answers nothing when every requested id was found', () => {
      const missing = TagCommonSubjectTagsModel.missingTagIds(
        ['1', '2'],
        [
          { id: '2', name: 'vip' },
          { id: '1', name: 'promo' },
        ],
      );

      expect(missing).toEqual([]);
    });
  });

  describe('toSnapshots', () => {
    it('answers the id and the name of every tag', () => {
      const snapshots = TagCommonSubjectTagsModel.toSnapshots([{ id: '1', name: 'promo' }]);

      expect(snapshots).toEqual([{ id: '1', name: 'promo' }]);
    });
  });

  describe('toReplaceLoggerPayload', () => {
    it('answers the subject and the tags it now carries', () => {
      const payload = TagCommonSubjectTagsModel.toReplaceLoggerPayload({
        subjectType: 'product',
        subjectId: '100',
        tags: [{ id: '1', name: 'promo' }],
      });

      expect(payload).toEqual({
        subjectType: 'product',
        subjectId: '100',
        subjectTags: [{ tagId: '1' }],
      });
    });
  });

  describe('replace', () => {
    let subjectTags: TagCommonSubjectTagsModel;

    beforeEach(() => {
      subjectTags = TagCommonSubjectTagsModel.reconstitute({
        subjectType: 'product',
        subjectId: '100',
        subjectTags: [{ tagId: '1' }, { tagId: '2' }],
      });
    });

    it('links the new tags and unlinks the dropped ones', () => {
      const changes = subjectTags.replace([
        { id: '2', name: 'vip' },
        { id: '3', name: 'heavy' },
      ]);

      expect(changes).toEqual({
        link: { subjectType: 'product', subjectId: '100', tagIds: ['3'] },
        unlink: { subjectType: 'product', subjectId: '100', tagIds: ['1'] },
      });
    });

    it('changes nothing when the subject already carries exactly the tags', () => {
      const changes = subjectTags.replace([
        { id: '2', name: 'vip' },
        { id: '1', name: 'promo' },
        { id: '2', name: 'vip' },
      ]);

      expect(changes).toEqual({
        link: { subjectType: 'product', subjectId: '100', tagIds: [] },
        unlink: { subjectType: 'product', subjectId: '100', tagIds: [] },
      });
    });

    it('unlinks every tag when the list is empty', () => {
      const changes = subjectTags.replace([]);

      expect(changes).toEqual({
        link: { subjectType: 'product', subjectId: '100', tagIds: [] },
        unlink: { subjectType: 'product', subjectId: '100', tagIds: ['1', '2'] },
      });
    });
  });
});
