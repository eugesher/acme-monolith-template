import type { PinoLogger } from 'nestjs-pino';

import { makePinoLoggerMock, type PinoLoggerMock } from '@acme-libs/testing';

import { NoteDeleteModel } from '../../../domain';
import { NoteDeleteUseCase } from '../note-delete.use-case';
import type { NoteAccessService } from '../../services/note-access.service';

describe('NoteDeleteUseCase', () => {
  let loadOwned: jest.Mock;
  let softDelete: jest.Mock;
  let logger: PinoLoggerMock;
  let useCase: NoteDeleteUseCase;

  beforeEach(() => {
    loadOwned = jest.fn().mockResolvedValue(
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
    softDelete = jest.fn().mockResolvedValue(undefined);
    logger = makePinoLoggerMock();
    useCase = new NoteDeleteUseCase(
      { loadOwned } as unknown as NoteAccessService,
      { softDelete },
      logger as unknown as PinoLogger,
    );
  });

  describe('execute', () => {
    it('deletes an owned note and logs its id', async () => {
      await expect(useCase.execute({ noteId: '7', authorId: 'admin-1' })).resolves.toBeUndefined();

      expect(loadOwned).toHaveBeenCalledWith(
        { noteId: '7', authorId: 'admin-1' },
        NoteDeleteModel.reconstitute,
      );
      expect(softDelete).toHaveBeenCalledWith('7');
      expect(logger.info).toHaveBeenCalledWith({ id: '7' }, 'Note deleted');
    });

    it('deletes nothing when the caller does not own the note', async () => {
      loadOwned.mockRejectedValue(new Error('not found'));

      await expect(useCase.execute({ noteId: '7', authorId: 'viewer-1' })).rejects.toThrow(
        'not found',
      );
      expect(softDelete).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('logs nothing when the delete fails', async () => {
      softDelete.mockRejectedValue(new Error('connection lost'));

      await expect(useCase.execute({ noteId: '7', authorId: 'admin-1' })).rejects.toThrow(
        'connection lost',
      );
      expect(logger.info).not.toHaveBeenCalled();
    });
  });
});
