import { NoteGetOneModel } from '../../../domain';
import { NoteAccessService } from '../note-access.service';
import type { INoteAccessRepositoryPort } from '../../../outbound';

describe('NoteAccessService', () => {
  let repository: jest.Mocked<INoteAccessRepositoryPort>;
  let service: NoteAccessService;

  beforeEach(() => {
    repository = { findOwned: jest.fn() };
    repository.findOwned.mockResolvedValue({
      id: '7',
      subjectType: 'product',
      subjectId: '42',
      body: 'Check the supplier',
      authorId: 'admin-1',
      resolved: false,
      version: 2,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    service = new NoteAccessService(repository);
  });

  describe('loadOwned', () => {
    it('answers the note of its author', async () => {
      const note = await service.loadOwned(
        { noteId: '7', authorId: 'admin-1' },
        NoteGetOneModel.reconstitute,
      );

      expect(repository.findOwned).toHaveBeenCalledWith({ noteId: '7', authorId: 'admin-1' });
      expect(note.id).toBe('7');
      expect(note.toSnapshot().authorId).toBe('admin-1');
    });

    it('refuses a note not found for the author with NOTE_NOT_FOUND', async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(
        service.loadOwned({ noteId: '7', authorId: 'admin-1' }, NoteGetOneModel.reconstitute),
      ).rejects.toMatchObject({
        code: 'NOTE_NOT_FOUND',
        message: 'Note 7 was not found',
      });
    });
  });

  describe('assertOwned', () => {
    it('passes for a note of its author', async () => {
      await expect(
        service.assertOwned({ noteId: '7', authorId: 'admin-1' }),
      ).resolves.toBeUndefined();
      expect(repository.findOwned).toHaveBeenCalledWith({ noteId: '7', authorId: 'admin-1' });
    });

    it('refuses a note not found for the author with NOTE_NOT_FOUND', async () => {
      repository.findOwned.mockResolvedValue(null);

      await expect(service.assertOwned({ noteId: '7', authorId: 'admin-1' })).rejects.toMatchObject(
        {
          code: 'NOTE_NOT_FOUND',
        },
      );
    });
  });
});
