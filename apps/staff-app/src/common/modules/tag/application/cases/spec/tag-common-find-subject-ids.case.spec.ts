import { TagCommonSubjectTypeEnum } from '@acme-staff/contracts/tag';

import { TagCommonFindSubjectIdsCase } from '../tag-common-find-subject-ids.case';
import type { ITagCommonFindSubjectIdsRepositoryPort } from '../../../outbound';

describe('TagCommonFindSubjectIdsCase', () => {
  let repository: jest.Mocked<ITagCommonFindSubjectIdsRepositoryPort>;
  let findSubjectIdsCase: TagCommonFindSubjectIdsCase;

  beforeEach(() => {
    repository = { findByTag: jest.fn() };
    repository.findByTag.mockResolvedValue([{ subjectId: '100' }, { subjectId: '101' }]);
    findSubjectIdsCase = new TagCommonFindSubjectIdsCase(repository);
  });

  describe('execute', () => {
    it('answers the ids of the subjects of a type that carry the tag', async () => {
      const subjectIds = await findSubjectIdsCase.execute({
        subjectType: TagCommonSubjectTypeEnum.PRODUCT,
        tagId: '300',
      });

      expect(repository.findByTag).toHaveBeenCalledWith({ subjectType: 'product', tagId: '300' });
      expect(subjectIds).toEqual(['100', '101']);
    });
  });
});
