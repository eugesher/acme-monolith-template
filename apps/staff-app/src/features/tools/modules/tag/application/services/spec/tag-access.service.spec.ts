import { TagUpdateModel } from '../../../domain';
import { TagAccessService } from '../tag-access.service';
import type { ITagAccessRepositoryPort } from '../../../outbound';

describe('TagAccessService', () => {
  let repository: jest.Mocked<ITagAccessRepositoryPort>;
  let service: TagAccessService;

  beforeEach(() => {
    repository = { findOne: jest.fn() };
    repository.findOne.mockResolvedValue({
      id: '300',
      name: 'fragile',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    service = new TagAccessService(repository);
  });

  describe('load', () => {
    it('answers the stored tag rebuilt by the model of the use case', async () => {
      const tag = await service.load({ tagId: '300' }, TagUpdateModel.reconstitute);

      expect(repository.findOne).toHaveBeenCalledWith('300');
      expect(tag.name).toBe('fragile');
    });

    it('refuses an unknown tag with TAG_NOT_FOUND', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.load({ tagId: '999' }, TagUpdateModel.reconstitute),
      ).rejects.toMatchObject({
        code: 'TAG_NOT_FOUND',
        message: 'Tag 999 was not found',
      });
    });
  });
});
