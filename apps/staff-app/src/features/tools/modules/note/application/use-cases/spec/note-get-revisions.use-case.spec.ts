import { NoteGetRevisionsUseCase } from '../note-get-revisions.use-case';
import type { NoteAccessService } from '../../services/note-access.service';

describe('NoteGetRevisionsUseCase', () => {
  let assertOwned: jest.Mock;
  let listForNote: jest.Mock;
  let useCase: NoteGetRevisionsUseCase;

  beforeEach(() => {
    assertOwned = jest.fn().mockResolvedValue(undefined);
    listForNote = jest.fn().mockResolvedValue([
      [
        {
          id: '11',
          noteId: '7',
          noteVersion: 2,
          bodyBefore: 'Check the supplier',
          bodyAfter: 'Supplier confirmed',
          editorId: 'admin-2',
          correlationId: 'c0ffee00-0000-4000-8000-000000000001',
          recordedAt: new Date('2026-01-02T00:00:00.123Z'),
        },
      ],
      1,
    ]);
    useCase = new NoteGetRevisionsUseCase({ assertOwned } as unknown as NoteAccessService, {
      listForNote,
    });
  });

  describe('execute', () => {
    it('answers a page of the revisions of an existing note', async () => {
      const page = await useCase.execute({ noteId: '7', authorId: 'admin-1', page: 2, limit: 5 });

      expect(assertOwned).toHaveBeenCalledWith({ noteId: '7', authorId: 'admin-1' });
      expect(listForNote).toHaveBeenCalledWith({ limit: 5, offset: 5, noteId: '7' });
      expect(page).toEqual({
        page: 2,
        count: 1,
        pageCount: 1,
        total: 1,
        data: [
          {
            id: '11',
            noteId: '7',
            noteVersion: 2,
            bodyBefore: 'Check the supplier',
            bodyAfter: 'Supplier confirmed',
            editorId: 'admin-2',
            correlationId: 'c0ffee00-0000-4000-8000-000000000001',
            recordedAt: '2026-01-02T00:00:00.123Z',
          },
        ],
      });
    });

    it('refuses the revisions of a missing note before listing them', async () => {
      assertOwned.mockRejectedValue(new Error('Note 7 was not found'));

      await expect(
        useCase.execute({ noteId: '7', authorId: 'admin-1', page: undefined, limit: undefined }),
      ).rejects.toThrow('Note 7 was not found');
      expect(listForNote).not.toHaveBeenCalled();
    });
  });
});
