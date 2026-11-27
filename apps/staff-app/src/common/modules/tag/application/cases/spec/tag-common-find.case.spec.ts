import { TagCommonSubjectTypeEnum } from '@acme-staff/contracts/tag';

import { TagCommonFindCase } from '../tag-common-find.case';
import type { ITagCommonFindRepositoryPort } from '../../../outbound';

describe('TagCommonFindCase', () => {
  let repository: jest.Mocked<ITagCommonFindRepositoryPort>;
  let findCase: TagCommonFindCase;

  beforeEach(() => {
    repository = { findBySubject: jest.fn() };
    repository.findBySubject.mockResolvedValue([
      { id: '300', name: 'fragile' },
      { id: '301', name: 'promo' },
    ]);
    findCase = new TagCommonFindCase(repository);
  });

  describe('execute', () => {
    it('answers the tags of the subject', async () => {
      const tags = await findCase.execute({
        subjectType: TagCommonSubjectTypeEnum.PRODUCT,
        subjectId: '100',
      });

      expect(repository.findBySubject).toHaveBeenCalledWith({
        subjectType: 'product',
        subjectId: '100',
      });
      expect(tags).toEqual([
        { id: '300', name: 'fragile' },
        { id: '301', name: 'promo' },
      ]);
    });
  });
});
