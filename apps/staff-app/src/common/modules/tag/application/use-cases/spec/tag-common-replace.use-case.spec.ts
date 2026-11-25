import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';
import { TagCommonSubjectTypeEnum } from '@acme-staff/contracts/tag';

import { TagCommonReplaceUseCase } from '../tag-common-replace.use-case';
import type { ITagCommonReplaceRepositoryPort, ITagCommonTransactionPort } from '../../../outbound';

describe('TagCommonReplaceUseCase', () => {
  let calls: string[];
  let repository: jest.Mocked<ITagCommonReplaceRepositoryPort>;
  let transaction: jest.Mocked<ITagCommonTransactionPort>;
  let logger: PinoLoggerMock;
  let useCase: TagCommonReplaceUseCase;

  beforeEach(() => {
    calls = [];
    repository = { lockMany: jest.fn(), findLinked: jest.fn(), link: jest.fn(), unlink: jest.fn() };
    repository.lockMany.mockImplementation(() => {
      calls.push('lockMany');

      return Promise.resolve([
        { id: '301', name: 'promo' },
        { id: '302', name: 'vip' },
      ]);
    });
    repository.findLinked.mockImplementation(() => {
      calls.push('findLinked');

      return Promise.resolve([{ tagId: '300' }, { tagId: '301' }]);
    });
    repository.link.mockImplementation(() => {
      calls.push('link');

      return Promise.resolve();
    });
    repository.unlink.mockImplementation(() => {
      calls.push('unlink');

      return Promise.resolve();
    });
    transaction = { run: jest.fn() };
    transaction.run.mockImplementation(async (work) => {
      calls.push('begin');

      const result = await work();

      calls.push('commit');

      return result;
    });
    logger = makePinoLoggerMock();
    useCase = new TagCommonReplaceUseCase(repository, transaction, logger);
  });

  describe('execute', () => {
    it('links the new tags and unlinks the dropped ones in one transaction', async () => {
      const view = await useCase.execute({
        subjectType: TagCommonSubjectTypeEnum.PRODUCT,
        subjectId: '100',
        tagIds: ['302', '301'],
      });

      expect(view).toEqual({
        outcome: 'replaced',
        tags: [
          { id: '301', name: 'promo' },
          { id: '302', name: 'vip' },
        ],
        missingTagIds: [],
      });
      expect(repository.lockMany).toHaveBeenCalledWith(['302', '301']);
      expect(repository.findLinked).toHaveBeenCalledWith({
        subjectType: 'product',
        subjectId: '100',
      });
      expect(repository.unlink).toHaveBeenCalledWith({
        subjectType: 'product',
        subjectId: '100',
        tagIds: ['300'],
      });
      expect(repository.link).toHaveBeenCalledWith({
        subjectType: 'product',
        subjectId: '100',
        tagIds: ['302'],
      });
      expect(calls).toEqual(['begin', 'lockMany', 'findLinked', 'unlink', 'link', 'commit']);
      expect(logger.info).toHaveBeenCalledWith(
        {
          subjectType: 'product',
          subjectId: '100',
          subjectTags: [{ tagId: '301' }, { tagId: '302' }],
        },
        'Subject tags replaced',
      );
    });

    it('answers tag-not-found and writes nothing when a tag does not exist', async () => {
      const view = await useCase.execute({
        subjectType: TagCommonSubjectTypeEnum.ORDER,
        subjectId: '600',
        tagIds: ['301', '998', '999'],
      });

      expect(view).toEqual({
        outcome: 'tag-not-found',
        tags: [],
        missingTagIds: ['998', '999'],
      });
      expect(calls).toEqual(['begin', 'lockMany', 'commit']);
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('clears the tags of the subject for an empty list', async () => {
      repository.lockMany.mockResolvedValue([]);

      const view = await useCase.execute({
        subjectType: TagCommonSubjectTypeEnum.ORDER,
        subjectId: '600',
        tagIds: [],
      });

      expect(view).toEqual({ outcome: 'replaced', tags: [], missingTagIds: [] });
      expect(repository.unlink).toHaveBeenCalledWith({
        subjectType: 'order',
        subjectId: '600',
        tagIds: ['300', '301'],
      });
      expect(repository.link).toHaveBeenCalledWith({
        subjectType: 'order',
        subjectId: '600',
        tagIds: [],
      });
    });

    it('does not commit when a write fails', async () => {
      repository.link.mockRejectedValue(new Error('connection lost'));

      await expect(
        useCase.execute({
          subjectType: TagCommonSubjectTypeEnum.PRODUCT,
          subjectId: '100',
          tagIds: ['301', '302'],
        }),
      ).rejects.toThrow('connection lost');
      expect(calls).not.toContain('commit');
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('neither links nor commits when the unlink fails', async () => {
      repository.unlink.mockRejectedValue(new Error('connection lost'));

      await expect(
        useCase.execute({
          subjectType: TagCommonSubjectTypeEnum.PRODUCT,
          subjectId: '100',
          tagIds: ['301', '302'],
        }),
      ).rejects.toThrow('connection lost');
      expect(repository.link).not.toHaveBeenCalled();
      expect(calls).not.toContain('commit');
    });
  });
});
