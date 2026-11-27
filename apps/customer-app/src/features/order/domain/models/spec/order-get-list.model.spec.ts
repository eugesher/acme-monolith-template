import { OrderGetListModel } from '../order-get-list.model';

describe('OrderGetListModel', () => {
  describe('toViewData', () => {
    it('answers the snapshot of every listed order', () => {
      const data = OrderGetListModel.toViewData([
        {
          id: '600',
          createdAt: new Date('2026-01-03T00:00:00.000Z'),
        },
      ]);

      expect(data).toEqual([
        {
          id: '600',
          createdAt: '2026-01-03T00:00:00.000Z',
        },
      ]);
    });

    it('answers no snapshots for no records', () => {
      expect(OrderGetListModel.toViewData([])).toEqual([]);
    });
  });
});
