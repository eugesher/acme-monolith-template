import { ProductStatusEnum } from '@acme-libs/kernel';

import { ProductController } from '../product.controller';
import type {
  ProductArchiveUseCase,
  ProductCreateUseCase,
  ProductGetManyUseCase,
  ProductGetOneUseCase,
  ProductGetTagsUseCase,
  ProductPublishUseCase,
  ProductReplaceTagsUseCase,
  ProductUpdateUseCase,
} from '../../../application';

describe('ProductController', () => {
  let create: jest.Mocked<Pick<ProductCreateUseCase, 'execute'>>;
  let getMany: jest.Mocked<Pick<ProductGetManyUseCase, 'execute'>>;
  let getOne: jest.Mocked<Pick<ProductGetOneUseCase, 'execute'>>;
  let update: jest.Mocked<Pick<ProductUpdateUseCase, 'execute'>>;
  let publish: jest.Mocked<Pick<ProductPublishUseCase, 'execute'>>;
  let archive: jest.Mocked<Pick<ProductArchiveUseCase, 'execute'>>;
  let getTags: jest.Mocked<Pick<ProductGetTagsUseCase, 'execute'>>;
  let replaceTags: jest.Mocked<Pick<ProductReplaceTagsUseCase, 'execute'>>;
  let controller: ProductController;

  beforeEach(() => {
    create = { execute: jest.fn() };
    getMany = { execute: jest.fn() };
    getOne = { execute: jest.fn() };
    update = { execute: jest.fn() };
    publish = { execute: jest.fn() };
    archive = { execute: jest.fn() };
    getTags = { execute: jest.fn() };
    replaceTags = { execute: jest.fn() };

    controller = new ProductController(
      create as unknown as ProductCreateUseCase,
      getMany as unknown as ProductGetManyUseCase,
      getOne as unknown as ProductGetOneUseCase,
      update as unknown as ProductUpdateUseCase,
      publish as unknown as ProductPublishUseCase,
      archive as unknown as ProductArchiveUseCase,
      getTags as unknown as ProductGetTagsUseCase,
      replaceTags as unknown as ProductReplaceTagsUseCase,
    );
  });

  describe('handleCreate', () => {
    it('creates the product of the body', async () => {
      create.execute.mockResolvedValue({
        id: '12',
        sku: 'SKU-1001',
        name: 'Lamp',
        status: ProductStatusEnum.DRAFT,
        version: 1,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleCreate({ sku: 'SKU-1001', name: 'Lamp' });

      expect(response).toEqual({
        id: '12',
        sku: 'SKU-1001',
        name: 'Lamp',
        status: 'draft',
        version: 1,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(create.execute).toHaveBeenCalledWith({ sku: 'SKU-1001', name: 'Lamp' });
    });
  });

  describe('handleGetMany', () => {
    it('lists the products of the page window and the tag', async () => {
      getMany.execute.mockResolvedValue({
        page: 2,
        limit: 5,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });

      const response = await controller.handleGetMany({ page: 2, limit: 5, tagId: '300' });

      expect(response).toEqual({ page: 2, limit: 5, count: 0, pageCount: 0, total: 0, data: [] });
      expect(getMany.execute).toHaveBeenCalledWith({ page: 2, limit: 5, tagId: '300' });
    });
  });

  describe('handleGetOne', () => {
    it('reads the product of the path', async () => {
      getOne.execute.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleGetOne({ productId: '12' });

      expect(response).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'active',
        version: 3,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(getOne.execute).toHaveBeenCalledWith({ productId: '12' });
    });
  });

  describe('handleUpdate', () => {
    it('updates the product of the path with the fields of the body', async () => {
      update.execute.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        name: 'Desk lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 4,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleUpdate({ productId: '12' }, { name: 'Desk lamp' }, 3);

      expect(response).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Desk lamp',
        status: 'active',
        version: 4,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(update.execute).toHaveBeenCalledWith({
        productId: '12',
        name: 'Desk lamp',
        expectedVersion: 3,
      });
    });

    it('passes no name for a body without one', async () => {
      update.execute.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      await controller.handleUpdate({ productId: '12' }, {}, undefined);

      expect(update.execute).toHaveBeenCalledWith({
        productId: '12',
        name: undefined,
        expectedVersion: undefined,
      });
    });
  });

  describe('handlePublish', () => {
    it('publishes the product of the path', async () => {
      publish.execute.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ACTIVE,
        version: 3,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handlePublish({ productId: '12' }, 2);

      expect(response).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'active',
        version: 3,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(publish.execute).toHaveBeenCalledWith({ productId: '12', expectedVersion: 2 });
    });
  });

  describe('handleArchive', () => {
    it('archives the product of the path', async () => {
      archive.execute.mockResolvedValue({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: ProductStatusEnum.ARCHIVED,
        version: 4,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleArchive({ productId: '12' }, undefined);

      expect(response).toEqual({
        id: '12',
        sku: 'SKU-0001',
        name: 'Lamp',
        status: 'archived',
        version: 4,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(archive.execute).toHaveBeenCalledWith({
        productId: '12',
        expectedVersion: undefined,
      });
    });
  });

  describe('handleGetTags', () => {
    it('reads the tags of the product of the path', async () => {
      getTags.execute.mockResolvedValue({ tags: [{ id: '300', name: 'fragile' }] });

      const response = await controller.handleGetTags({ productId: '12' });

      expect(response).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
      expect(getTags.execute).toHaveBeenCalledWith({ productId: '12' });
    });
  });

  describe('handleReplaceTags', () => {
    it('replaces the tags of the product of the path with the tags of the body', async () => {
      replaceTags.execute.mockResolvedValue({ tags: [{ id: '300', name: 'fragile' }] });

      const response = await controller.handleReplaceTags({ productId: '12' }, { tagIds: ['300'] });

      expect(response).toEqual({ tags: [{ id: '300', name: 'fragile' }] });
      expect(replaceTags.execute).toHaveBeenCalledWith({ productId: '12', tagIds: ['300'] });
    });
  });
});
