import { TagController } from '../tag.controller';
import type {
  TagCreateUseCase,
  TagDeleteUseCase,
  TagGetManyUseCase,
  TagRenameUseCase,
} from '../../application';

describe('TagController', () => {
  let create: jest.Mocked<Pick<TagCreateUseCase, 'execute'>>;
  let getMany: jest.Mocked<Pick<TagGetManyUseCase, 'execute'>>;
  let rename: jest.Mocked<Pick<TagRenameUseCase, 'execute'>>;
  let remove: jest.Mocked<Pick<TagDeleteUseCase, 'execute'>>;
  let controller: TagController;

  beforeEach(() => {
    create = { execute: jest.fn() };
    getMany = { execute: jest.fn() };
    rename = { execute: jest.fn() };
    remove = { execute: jest.fn() };

    controller = new TagController(
      create as unknown as TagCreateUseCase,
      getMany as unknown as TagGetManyUseCase,
      rename as unknown as TagRenameUseCase,
      remove as unknown as TagDeleteUseCase,
    );
  });

  describe('handleCreate', () => {
    it('creates the tag of the body', async () => {
      create.execute.mockResolvedValue({
        id: '303',
        name: 'heavy',
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleCreate({ name: 'heavy' });

      expect(response).toEqual({
        id: '303',
        name: 'heavy',
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(create.execute).toHaveBeenCalledWith({ name: 'heavy' });
    });
  });

  describe('handleGetMany', () => {
    it('lists the tags of the page window', async () => {
      getMany.execute.mockResolvedValue({
        page: 2,
        limit: 5,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });

      const response = await controller.handleGetMany({ page: 2, limit: 5 });

      expect(response).toEqual({ page: 2, limit: 5, count: 0, pageCount: 0, total: 0, data: [] });
      expect(getMany.execute).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });
  });

  describe('handleRename', () => {
    it('renames the tag of the path to the name of the body', async () => {
      rename.execute.mockResolvedValue({
        id: '300',
        name: 'handle-with-care',
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleRename(
        { tagId: '300' },
        { name: 'handle-with-care' },
      );

      expect(response).toEqual({
        id: '300',
        name: 'handle-with-care',
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(rename.execute).toHaveBeenCalledWith({ tagId: '300', name: 'handle-with-care' });
    });
  });

  describe('handleDelete', () => {
    it('deletes the tag of the path', async () => {
      remove.execute.mockResolvedValue(undefined);

      await expect(controller.handleDelete({ tagId: '300' })).resolves.toBeUndefined();

      expect(remove.execute).toHaveBeenCalledWith({ tagId: '300' });
    });

    it('lets a failed delete reject', async () => {
      remove.execute.mockRejectedValue(new Error('tag is in use'));

      await expect(controller.handleDelete({ tagId: '300' })).rejects.toThrow('tag is in use');
    });
  });
});
