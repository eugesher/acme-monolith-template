import { NoteGetOneModel } from '../../../domain';
import { NoteGetOneUseCase } from '../note-get-one.use-case';
import type { NoteAccessService } from '../../services/note-access.service';

describe('NoteGetOneUseCase', () => {
  let accessService: jest.Mocked<Pick<NoteAccessService, 'loadOwned'>>;
  let useCase: NoteGetOneUseCase;

  beforeEach(() => {
    accessService = { loadOwned: jest.fn() };
    accessService.loadOwned.mockResolvedValue(
      NoteGetOneModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: false,
        version: 2,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      }),
    );
    useCase = new NoteGetOneUseCase(accessService as unknown as NoteAccessService);
  });

  describe('execute', () => {
    it('answers the note', async () => {
      const view = await useCase.execute({ noteId: '7', authorId: 'admin-1' });

      expect(accessService.loadOwned).toHaveBeenCalledWith(
        { noteId: '7', authorId: 'admin-1' },
        NoteGetOneModel.reconstitute,
      );
      expect(view).toEqual({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
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
