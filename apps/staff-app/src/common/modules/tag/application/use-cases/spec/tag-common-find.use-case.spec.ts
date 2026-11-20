import { TagCommonSubjectTypeEnum } from '@acme-staff/contracts/tag';

import { TagCommonFindUseCase } from '../tag-common-find.use-case';
import type { ITagCommonFindRepositoryPort } from '../../../outbound';

describe('TagCommonFindUseCase', () => {
  let repository: jest.Mocked<ITagCommonFindRepositoryPort>;
  let useCase: TagCommonFindUseCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([
      { id: '300', name: 'fragile' },
      { id: '301', name: 'promo' },
    ]);
    useCase = new TagCommonFindUseCase(repository);
  });

  describe('execute', () => {
    it('answers the tags of the subject', async () => {
      const tags = await useCase.execute({
        subjectType: TagCommonSubjectTypeEnum.PRODUCT,
        subjectId: '100',
      });

      expect(repository.list).toHaveBeenCalledWith({ subjectType: 'product', subjectId: '100' });
      expect(tags).toEqual([
        { id: '300', name: 'fragile' },
        { id: '301', name: 'promo' },
      ]);
    });
  });
});
