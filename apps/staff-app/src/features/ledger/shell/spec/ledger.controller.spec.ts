import { LedgerListEntriesUseCase } from '../../application';
import { LedgerController } from '../ledger.controller';

describe('LedgerController', () => {
  let repository: jest.Mocked<ConstructorParameters<typeof LedgerListEntriesUseCase>[0]>;
  let controller: LedgerController;

  beforeEach(() => {
    repository = { list: jest.fn() };
    controller = new LedgerController(new LedgerListEntriesUseCase(repository));
  });

  describe('handleList', () => {
    it('answers the page for the filters of the query string', async () => {
      repository.list.mockResolvedValue([[], 0]);

      const response = await controller.handleList({ subjectType: 'product', subjectId: '12' });

      expect(response).toEqual({ page: 1, limit: 20, count: 0, pageCount: 0, total: 0, data: [] });
      expect(repository.list).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
        subjectType: 'product',
        subjectId: '12',
        correlationId: undefined,
      });
    });
  });
});
