import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { TagUpdateModel } from '../../../domain';
import { TagUpdateOutcomeEnum, type ITagUpdateRepositoryPort } from '../../../outbound';
import { TagUpdateCase } from '../tag-update.case';
import type { TagAccessService } from '../../services/tag-access.service';

describe('TagUpdateCase', () => {
  let accessService: jest.Mocked<Pick<TagAccessService, 'load'>>;
  let repository: jest.Mocked<ITagUpdateRepositoryPort>;
  let logger: PinoLoggerMock;
  let updateCase: TagUpdateCase;

  beforeEach(() => {
    accessService = { load: jest.fn() };
    accessService.load
      .mockResolvedValueOnce(
        TagUpdateModel.reconstitute({
          id: '300',
          name: 'fragile',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        }),
      )
      .mockResolvedValueOnce(
        TagUpdateModel.reconstitute({
          id: '300',
          name: 'handle-with-care',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        }),
      );
    repository = { update: jest.fn() };
    repository.update.mockResolvedValue(TagUpdateOutcomeEnum.UPDATED);
    logger = makePinoLoggerMock();
    updateCase = new TagUpdateCase(
      accessService as unknown as TagAccessService,
      repository,
      logger,
    );
  });

  describe('execute', () => {
    it('stores the new name and answers the stored tag', async () => {
      const view = await updateCase.execute({ tagId: '300', name: ' handle-with-care ' });

      expect(repository.update).toHaveBeenCalledWith({ id: '300', name: 'handle-with-care' });
      expect(accessService.load).toHaveBeenNthCalledWith(
        1,
        { tagId: '300' },
        TagUpdateModel.reconstitute,
      );
      expect(accessService.load).toHaveBeenNthCalledWith(
        2,
        { tagId: '300' },
        TagUpdateModel.reconstitute,
      );
      expect(view).toEqual({
        id: '300',
        name: 'handle-with-care',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith(
        { id: '300', name: 'handle-with-care' },
        'Tag updated',
      );
    });

    it('writes nothing when the name does not change', async () => {
      const view = await updateCase.execute({ tagId: '300', name: 'fragile' });

      expect(repository.update).not.toHaveBeenCalled();
      expect(accessService.load).toHaveBeenCalledTimes(1);
      expect(view.name).toBe('fragile');
    });

    it('refuses an empty name with TAG_NAME_INVALID and writes nothing', async () => {
      await expect(updateCase.execute({ tagId: '300', name: ' ' })).rejects.toMatchObject({
        code: 'TAG_NAME_INVALID',
        message: 'Tag.name must be a non-empty string of at most 64 characters',
      });
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('turns a duplicate key into TAG_NAME_TAKEN', async () => {
      repository.update.mockResolvedValue(TagUpdateOutcomeEnum.DUPLICATE);

      await expect(updateCase.execute({ tagId: '300', name: 'promo' })).rejects.toMatchObject({
        code: 'TAG_NAME_TAKEN',
        message: 'A tag named promo already exists',
      });
    });

    it('rethrows any other error of the update', async () => {
      repository.update.mockRejectedValue(new Error('connection lost'));

      await expect(updateCase.execute({ tagId: '300', name: 'promo' })).rejects.toThrow(
        'connection lost',
      );
    });

    it('writes nothing for an unknown tag', async () => {
      accessService.load.mockReset().mockRejectedValue(new Error('not found'));

      await expect(updateCase.execute({ tagId: '999', name: 'promo' })).rejects.toThrow(
        'not found',
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
