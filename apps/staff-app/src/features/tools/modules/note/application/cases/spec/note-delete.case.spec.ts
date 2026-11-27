import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { NoteDeleteModel } from '../../../domain';
import { NoteDeleteCase } from '../note-delete.case';
import type { INoteDeleteRepositoryPort } from '../../../outbound';
import type { NoteAccessService } from '../../services/note-access.service';

describe('NoteDeleteCase', () => {
  let accessService: jest.Mocked<Pick<NoteAccessService, 'loadOwned'>>;
  let repository: jest.Mocked<INoteDeleteRepositoryPort>;
  let logger: PinoLoggerMock;
  let deleteCase: NoteDeleteCase;

  beforeEach(() => {
    accessService = { loadOwned: jest.fn() };
    accessService.loadOwned.mockResolvedValue(
      NoteDeleteModel.reconstitute({
        id: '7',
        subjectType: 'product',
        subjectId: '42',
        body: 'Check the supplier',
        authorId: 'admin-1',
        resolved: true,
        version: 3,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    );
    repository = { softDelete: jest.fn() };
    repository.softDelete.mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    deleteCase = new NoteDeleteCase(
      accessService as unknown as NoteAccessService,
      repository,
      logger,
    );
  });

  describe('execute', () => {
    it('deletes an owned note and logs its id', async () => {
      await expect(
        deleteCase.execute({ noteId: '7', authorId: 'admin-1' }),
      ).resolves.toBeUndefined();

      expect(accessService.loadOwned).toHaveBeenCalledWith(
        { noteId: '7', authorId: 'admin-1' },
        NoteDeleteModel.reconstitute,
      );
      expect(repository.softDelete).toHaveBeenCalledWith('7');
      expect(logger.info).toHaveBeenCalledWith({ id: '7' }, 'Note deleted');
    });

    it('deletes nothing when the caller does not own the note', async () => {
      accessService.loadOwned.mockRejectedValue(new Error('not found'));

      await expect(deleteCase.execute({ noteId: '7', authorId: 'viewer-1' })).rejects.toThrow(
        'not found',
      );
      expect(repository.softDelete).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('logs nothing when the delete fails', async () => {
      repository.softDelete.mockRejectedValue(new Error('connection lost'));

      await expect(deleteCase.execute({ noteId: '7', authorId: 'admin-1' })).rejects.toThrow(
        'connection lost',
      );
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
