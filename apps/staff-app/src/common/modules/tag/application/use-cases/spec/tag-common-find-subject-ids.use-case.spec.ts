import { TagCommonSubjectTypeEnum } from '@acme-staff/contracts/tag';

import { TagCommonFindSubjectIdsUseCase } from '../tag-common-find-subject-ids.use-case';
import type { ITagCommonFindSubjectIdsRepositoryPort } from '../../../outbound';

describe('TagCommonFindSubjectIdsUseCase', () => {
  let repository: jest.Mocked<ITagCommonFindSubjectIdsRepositoryPort>;
  let useCase: TagCommonFindSubjectIdsUseCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([{ subjectId: '100' }, { subjectId: '101' }]);
    useCase = new TagCommonFindSubjectIdsUseCase(repository);
  });

  describe('execute', () => {
    it('answers the ids of the subjects of a type that carry the tag', async () => {
      const subjectIds = await useCase.execute({
        subjectType: TagCommonSubjectTypeEnum.PRODUCT,
        tagId: '300',
      });

      expect(repository.list).toHaveBeenCalledWith({ subjectType: 'product', tagId: '300' });
      expect(subjectIds).toEqual(['100', '101']);
    });
  });
});
