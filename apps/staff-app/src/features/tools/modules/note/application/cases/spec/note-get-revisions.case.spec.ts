import { NoteGetRevisionsCase } from '../note-get-revisions.case';
import type { INoteGetRevisionsRepositoryPort } from '../../../outbound';
import type { NoteAccessService } from '../../services/note-access.service';

describe('NoteGetRevisionsCase', () => {
  let accessService: jest.Mocked<Pick<NoteAccessService, 'assertOwned'>>;
  let repository: jest.Mocked<INoteGetRevisionsRepositoryPort>;
  let getRevisionsCase: NoteGetRevisionsCase;

  beforeEach(() => {
    accessService = { assertOwned: jest.fn() };
    accessService.assertOwned.mockResolvedValue(undefined);
    repository = { list: jest.fn() };
    repository.list.mockResolvedValue([
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
    getRevisionsCase = new NoteGetRevisionsCase(
      accessService as unknown as NoteAccessService,
      repository,
    );
  });

  describe('execute', () => {
    it('answers a page of the revisions of an existing note', async () => {
      const page = await getRevisionsCase.execute({
        noteId: '7',
        authorId: 'admin-1',
        page: 2,
        limit: 5,
      });

      expect(accessService.assertOwned).toHaveBeenCalledWith({ noteId: '7', authorId: 'admin-1' });
      expect(repository.list).toHaveBeenCalledWith({ limit: 5, offset: 5, noteId: '7' });
      expect(page).toEqual({
        page: 2,
        limit: 5,
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
      accessService.assertOwned.mockRejectedValue(new Error('Note 7 was not found'));

      await expect(
        getRevisionsCase.execute({
          noteId: '7',
          authorId: 'admin-1',
          page: undefined,
          limit: undefined,
        }),
      ).rejects.toThrow('Note 7 was not found');
      expect(repository.list).not.toHaveBeenCalled();
    });
  });
});
