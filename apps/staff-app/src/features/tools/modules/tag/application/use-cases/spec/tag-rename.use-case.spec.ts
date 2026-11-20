import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { TagRenameModel } from '../../../domain';
import { TagRenameUpdateOutcomeEnum, type ITagRenameRepositoryPort } from '../../../outbound';
import { TagRenameUseCase } from '../tag-rename.use-case';
import type { TagAccessService } from '../../services/tag-access.service';

describe('TagRenameUseCase', () => {
  let accessService: jest.Mocked<Pick<TagAccessService, 'load'>>;
  let repository: jest.Mocked<ITagRenameRepositoryPort>;
  let logger: PinoLoggerMock;
  let useCase: TagRenameUseCase;

  beforeEach(() => {
    accessService = { load: jest.fn() };
    accessService.load
      .mockResolvedValueOnce(
        TagRenameModel.reconstitute({
          id: '300',
          name: 'fragile',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      )
      .mockResolvedValueOnce(
        TagRenameModel.reconstitute({
          id: '300',
          name: 'handle-with-care',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        }),
      );
    repository = { update: jest.fn() };
    repository.update.mockResolvedValue(TagRenameUpdateOutcomeEnum.UPDATED);
    logger = makePinoLoggerMock();
    useCase = new TagRenameUseCase(
      accessService as unknown as TagAccessService,
      repository,
      logger,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('stores the new name and answers the stored tag', async () => {
      const view = await useCase.execute({ tagId: '300', name: ' handle-with-care ' });

      expect(repository.update).toHaveBeenCalledWith({ id: '300', name: 'handle-with-care' });
      expect(accessService.load).toHaveBeenNthCalledWith(
        1,
        { tagId: '300' },
        TagRenameModel.reconstitute,
      );
      expect(accessService.load).toHaveBeenNthCalledWith(
        2,
        { tagId: '300' },
        TagRenameModel.reconstitute,
      );
      expect(view).toEqual({
        id: '300',
        name: 'handle-with-care',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { id: '300', name: 'handle-with-care' },
        'Tag renamed',
      );
    });

    it('writes nothing when the name does not change', async () => {
      const view = await useCase.execute({ tagId: '300', name: 'fragile' });

      expect(repository.update).not.toHaveBeenCalled();
      expect(accessService.load).toHaveBeenCalledTimes(1);
      expect(view.name).toBe('fragile');
    });

    it('refuses an empty name with TAG_NAME_INVALID and writes nothing', async () => {
      await expect(useCase.execute({ tagId: '300', name: ' ' })).rejects.toMatchObject({
        code: 'TAG_NAME_INVALID',
        message: 'Tag.name must be a non-empty string of at most 64 characters',
      });
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('turns a duplicate key into TAG_NAME_TAKEN', async () => {
      repository.update.mockResolvedValue(TagRenameUpdateOutcomeEnum.DUPLICATE);

      await expect(useCase.execute({ tagId: '300', name: 'promo' })).rejects.toMatchObject({
        code: 'TAG_NAME_TAKEN',
        message: 'A tag named promo already exists',
      });
    });

    it('rethrows any other error of the update', async () => {
      repository.update.mockRejectedValue(new Error('connection lost'));

      await expect(useCase.execute({ tagId: '300', name: 'promo' })).rejects.toThrow(
        'connection lost',
      );
    });

    it('writes nothing for an unknown tag', async () => {
      accessService.load.mockReset().mockRejectedValue(new Error('not found'));

      await expect(useCase.execute({ tagId: '999', name: 'promo' })).rejects.toThrow('not found');
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
