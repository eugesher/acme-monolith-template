import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { TagNameInvalidException, TagNameTakenException } from '../../../domain';
import { TagCreateInsertOutcomeEnum, type ITagCreateRepositoryPort } from '../../../outbound';
import { TagCreateUseCase } from '../tag-create.use-case';

describe('TagCreateUseCase', () => {
  let repository: jest.Mocked<ITagCreateRepositoryPort>;
  let logger: PinoLoggerMock;
  let useCase: TagCreateUseCase;

  beforeEach(() => {
    repository = { insert: jest.fn(), findInserted: jest.fn() };
    repository.insert.mockResolvedValue({
      outcome: TagCreateInsertOutcomeEnum.INSERTED,
      id: '303',
    });
    repository.findInserted.mockResolvedValue({
      id: '303',
      name: 'heavy',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    logger = makePinoLoggerMock();
    useCase = new TagCreateUseCase(repository, logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('stores the trimmed name and answers the stored tag', async () => {
      const view = await useCase.execute({ name: ' heavy ' });

      expect(repository.insert).toHaveBeenCalledWith({ name: 'heavy' });
      expect(repository.findInserted).toHaveBeenCalledWith('303');
      expect(view).toEqual({
        id: '303',
        name: 'heavy',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });
      expect(logger.info).toHaveBeenCalledWith({ id: '303', name: 'heavy' }, 'Tag created');
    });

    it('throws TagNameInvalidException and stores nothing for an empty name', async () => {
      await expect(useCase.execute({ name: ' ' })).rejects.toThrow(TagNameInvalidException);
      expect(repository.insert).not.toHaveBeenCalled();
    });

    it('turns a duplicate key into TagNameTakenException', async () => {
      repository.insert.mockResolvedValue({ outcome: TagCreateInsertOutcomeEnum.DUPLICATE });

      await expect(useCase.execute({ name: 'fragile' })).rejects.toThrow(TagNameTakenException);
      expect(repository.findInserted).not.toHaveBeenCalled();
    });

    it('rethrows any other error of the insert', async () => {
      repository.insert.mockRejectedValue(new Error('connection lost'));

      await expect(useCase.execute({ name: 'fragile' })).rejects.toThrow('connection lost');
    });
  });
});
