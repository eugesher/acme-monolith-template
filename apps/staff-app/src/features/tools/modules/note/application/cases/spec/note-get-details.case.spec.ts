import { NoteGetDetailsModel } from '../../../domain';
import { NoteGetDetailsCase } from '../note-get-details.case';
import type { NoteAccessService } from '../../services/note-access.service';

describe('NoteGetDetailsCase', () => {
  let accessService: jest.Mocked<Pick<NoteAccessService, 'loadOwned'>>;
  let getDetailsCase: NoteGetDetailsCase;

  beforeEach(() => {
    accessService = { loadOwned: jest.fn() };
    accessService.loadOwned.mockResolvedValue(
      NoteGetDetailsModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      }),
    );
    getDetailsCase = new NoteGetDetailsCase(accessService as unknown as NoteAccessService);
  });

  describe('execute', () => {
    it('answers the note', async () => {
      const view = await getDetailsCase.execute({ noteId: '7', authorId: 'admin-1' });

      expect(accessService.loadOwned).toHaveBeenCalledWith(
        { noteId: '7', authorId: 'admin-1' },
        NoteGetDetailsModel.reconstitute,
      );
      expect(view).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        title: 'Customer call',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      });
    });
  });
});
