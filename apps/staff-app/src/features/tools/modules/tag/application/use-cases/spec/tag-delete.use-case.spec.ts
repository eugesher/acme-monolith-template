import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { TagDeleteModel } from '../../../domain';
import { TagDeleteUseCase } from '../tag-delete.use-case';
import type { ITagDeleteRepositoryPort } from '../../../outbound';
import type { TagAccessService } from '../../services/tag-access.service';

describe('TagDeleteUseCase', () => {
  let accessService: jest.Mocked<Pick<TagAccessService, 'load'>>;
  let repository: jest.Mocked<ITagDeleteRepositoryPort>;
  let logger: PinoLoggerMock;
  let useCase: TagDeleteUseCase;

  beforeEach(() => {
    accessService = { load: jest.fn() };
    accessService.load.mockResolvedValue(
      TagDeleteModel.reconstitute({
        id: '300',
        name: 'fragile',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    );
    repository = { delete: jest.fn() };
    repository.delete.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new TagDeleteUseCase(
      accessService as unknown as TagAccessService,
      repository,
      logger,
    );
  });

  describe('execute', () => {
    it('deletes an existing tag', async () => {
      await expect(useCase.execute({ tagId: '300' })).resolves.toBeUndefined();

      expect(accessService.load).toHaveBeenCalledWith(
        { tagId: '300' },
        TagDeleteModel.reconstitute,
      );
      expect(repository.delete).toHaveBeenCalledWith('300');
      expect(logger.info).toHaveBeenCalledWith({ id: '300' }, 'Tag deleted');
    });

    it('deletes nothing for an unknown tag', async () => {
      accessService.load.mockRejectedValue(new Error('not found'));

      await expect(useCase.execute({ tagId: '999' })).rejects.toThrow('not found');
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
