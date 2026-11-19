import { TagNotFoundException, TagRenameModel } from '../../../domain';
import { TagAccessService } from '../tag-access.service';
import type { ITagAccessRepositoryPort } from '../../../outbound';

describe('TagAccessService', () => {
  let repository: jest.Mocked<ITagAccessRepositoryPort>;
  let service: TagAccessService;

  beforeEach(() => {
    repository = { findById: jest.fn() };
    repository.findById.mockResolvedValue({
      id: '300',
      name: 'fragile',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    service = new TagAccessService(repository);
  });

  describe('load', () => {
    it('answers the stored tag rebuilt by the model of the use case', async () => {
      const tag = await service.load({ tagId: '300' }, TagRenameModel.reconstitute);

      expect(repository.findById).toHaveBeenCalledWith('300');
      expect(tag.name).toBe('fragile');
    });

    it('throws TagNotFoundException for an unknown tag', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.load({ tagId: '999' }, TagRenameModel.reconstitute)).rejects.toThrow(
        TagNotFoundException,
      );
    });
  });
});
