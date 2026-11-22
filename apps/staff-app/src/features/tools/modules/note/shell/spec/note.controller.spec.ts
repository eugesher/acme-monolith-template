import { NoteController } from '../note.controller';
import type {
  NoteCreateUseCase,
  NoteDeleteUseCase,
  NoteEditUseCase,
  NoteGetManyUseCase,
  NoteGetOneUseCase,
  NoteGetRevisionsUseCase,
  NoteResolveUseCase,
} from '../../application';

describe('NoteController', () => {
  let create: jest.Mocked<Pick<NoteCreateUseCase, 'execute'>>;
  let getMany: jest.Mocked<Pick<NoteGetManyUseCase, 'execute'>>;
  let getOne: jest.Mocked<Pick<NoteGetOneUseCase, 'execute'>>;
  let edit: jest.Mocked<Pick<NoteEditUseCase, 'execute'>>;
  let resolve: jest.Mocked<Pick<NoteResolveUseCase, 'execute'>>;
  let getRevisions: jest.Mocked<Pick<NoteGetRevisionsUseCase, 'execute'>>;
  let remove: jest.Mocked<Pick<NoteDeleteUseCase, 'execute'>>;
  let controller: NoteController;

  beforeEach(() => {
    create = { execute: jest.fn() };
    getMany = { execute: jest.fn() };
    getOne = { execute: jest.fn() };
    edit = { execute: jest.fn() };
    resolve = { execute: jest.fn() };
    getRevisions = { execute: jest.fn() };
    remove = { execute: jest.fn() };

    controller = new NoteController(
      create as unknown as NoteCreateUseCase,
      getMany as unknown as NoteGetManyUseCase,
      getOne as unknown as NoteGetOneUseCase,
      edit as unknown as NoteEditUseCase,
      resolve as unknown as NoteResolveUseCase,
      getRevisions as unknown as NoteGetRevisionsUseCase,
      remove as unknown as NoteDeleteUseCase,
    );
  });

  describe('handleCreate', () => {
    it('creates the note of the body with the caller as its author', async () => {
      create.execute.mockResolvedValue({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
        resolved: false,
        version: 1,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleCreate(
        { subjectType: 'product', subjectId: '42', body: 'Refunded' },
        { id: 'user-1', email: 'ann@example.com' },
      );

      expect(response).toEqual({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
        resolved: false,
        version: 1,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(create.execute).toHaveBeenCalledWith({
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
      });
    });
  });

  describe('handleGetMany', () => {
    it('lists the notes of the query written by the caller', async () => {
      getMany.execute.mockResolvedValue({
        page: 2,
        limit: 5,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });

      const response = await controller.handleGetMany(
        { page: 2, limit: 5, subjectType: 'product', subjectId: '42', resolved: false },
        { id: 'user-1', email: 'ann@example.com' },
      );

      expect(response).toEqual({ page: 2, limit: 5, count: 0, pageCount: 0, total: 0, data: [] });
      expect(getMany.execute).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        subjectType: 'product',
        subjectId: '42',
        resolved: false,
        authorId: 'user-1',
      });
    });
  });

  describe('handleGetOne', () => {
    it('reads the note of the path for the caller', async () => {
      getOne.execute.mockResolvedValue({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
        resolved: false,
        version: 1,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });

      const response = await controller.handleGetOne(
        { noteId: '17' },
        { id: 'user-1', email: 'ann@example.com' },
      );

      expect(response).toEqual({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
        resolved: false,
        version: 1,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-05T08:00:00.000Z',
      });
      expect(getOne.execute).toHaveBeenCalledWith({ noteId: '17', authorId: 'user-1' });
    });
  });

  describe('handleEdit', () => {
    it('edits the note of the path with the body of the request, the caller as editor and the If-Match version', async () => {
      edit.execute.mockResolvedValue({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded twice',
        authorId: 'user-1',
        resolved: false,
        version: 2,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-06T08:00:00.000Z',
      });

      const response = await controller.handleEdit(
        { noteId: '17' },
        { body: 'Refunded twice' },
        { id: 'user-1', email: 'ann@example.com' },
        1,
      );

      expect(response).toEqual({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded twice',
        authorId: 'user-1',
        resolved: false,
        version: 2,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-06T08:00:00.000Z',
      });
      expect(edit.execute).toHaveBeenCalledWith({
        noteId: '17',
        body: 'Refunded twice',
        editorId: 'user-1',
        expectedVersion: 1,
      });
    });
  });

  describe('handleResolve', () => {
    it('resolves the note of the path for the caller without an expected version', async () => {
      resolve.execute.mockResolvedValue({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
        resolved: true,
        version: 2,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-06T08:00:00.000Z',
      });

      const response = await controller.handleResolve(
        { noteId: '17' },
        { id: 'user-1', email: 'ann@example.com' },
        undefined,
      );

      expect(response).toEqual({
        id: '17',
        subjectType: 'product',
        subjectId: '42',
        body: 'Refunded',
        authorId: 'user-1',
        resolved: true,
        version: 2,
        createdAt: '2026-01-05T08:00:00.000Z',
        updatedAt: '2026-01-06T08:00:00.000Z',
      });
      expect(resolve.execute).toHaveBeenCalledWith({
        noteId: '17',
        authorId: 'user-1',
        expectedVersion: undefined,
      });
    });
  });

  describe('handleGetRevisions', () => {
    it('lists the revisions of the note of the path for the caller', async () => {
      getRevisions.execute.mockResolvedValue({
        page: 1,
        limit: 20,
        count: 0,
        pageCount: 0,
        total: 0,
        data: [],
      });

      const response = await controller.handleGetRevisions(
        { noteId: '17' },
        { page: 1, limit: 20 },
        { id: 'user-1', email: 'ann@example.com' },
      );

      expect(response).toEqual({ page: 1, limit: 20, count: 0, pageCount: 0, total: 0, data: [] });
      expect(getRevisions.execute).toHaveBeenCalledWith({
        noteId: '17',
        authorId: 'user-1',
        page: 1,
        limit: 20,
      });
    });
  });

  describe('handleDelete', () => {
    it('deletes the note of the path for the caller', async () => {
      remove.execute.mockResolvedValue(undefined);

      await expect(
        controller.handleDelete({ noteId: '17' }, { id: 'user-1', email: 'ann@example.com' }),
      ).resolves.toBeUndefined();
      expect(remove.execute).toHaveBeenCalledWith({ noteId: '17', authorId: 'user-1' });
    });
  });
});
