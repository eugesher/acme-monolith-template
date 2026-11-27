import { NoteGetListCase } from '../note-get-list.case';
import type { INoteGetListRepositoryPort } from '../../../outbound';

describe('NoteGetListCase', () => {
  let repository: jest.Mocked<INoteGetListRepositoryPort>;
  let getListCase: NoteGetListCase;

  beforeEach(() => {
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([
      [
        {
          id: '7',
          subjectType: 'product',
          subjectId: '42',
          title: 'Customer call',
          authorId: 'admin-1',
          resolved: false,
          version: 2,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
        },
      ],
      1,
    ]);
    getListCase = new NoteGetListCase(repository);
  });

  describe('execute', () => {
    it('lists the notes of the author on the default page when nothing else is filtered', async () => {
      const page = await getListCase.execute({
        page: undefined,
        limit: undefined,
        subjectType: undefined,
        subjectId: undefined,
        resolved: undefined,
        authorId: 'admin-1',
      });

      expect(repository.list).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        subjectType: undefined,
        subjectId: undefined,
        resolved: undefined,
        authorId: 'admin-1',
      });
      expect(page).toEqual({
        page: 1,
        limit: 20,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [
          {
            id: '7',
            subjectType: 'product',
            subjectId: '42',
            title: 'Customer call',
            authorId: 'admin-1',
            resolved: false,
            version: 2,
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-02T00:00:00.000Z',
          },
        ],
      });
    });

    it('passes a subject, a resolution filter and a clamped window', async () => {
      await getListCase.execute({
        page: 0,
        limit: 500,
        subjectType: 'product',
        subjectId: '42',
        resolved: false,
        authorId: 'admin-1',
      });

      expect(repository.list).toHaveBeenCalledWith({
        limit: 100,
        offset: 0,
        subjectType: 'product',
        subjectId: '42',
        resolved: false,
        authorId: 'admin-1',
      });
    });

    it.each([
      ['only a subject type', 'product', undefined],
      ['only a subject id', undefined, '42'],
    ])('refuses %s with NOTE_SUBJECT_INVALID', async (_case, subjectType, subjectId) => {
      await expect(
        getListCase.execute({
          page: undefined,
          limit: undefined,
          subjectType,
          subjectId,
          resolved: undefined,
          authorId: 'admin-1',
        }),
      ).rejects.toMatchObject({
        code: 'NOTE_SUBJECT_INVALID',
        message: 'A subject filter needs both subjectType and subjectId, or neither',
      });
      expect(repository.list).not.toHaveBeenCalled();
    });
  });
});
