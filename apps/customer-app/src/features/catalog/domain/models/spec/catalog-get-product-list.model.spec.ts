import { CatalogGetProductListModel } from '../catalog-get-product-list.model';

describe('CatalogGetProductListModel', () => {
  describe('toViewData', () => {
    it('answers the snapshot of every listed product', () => {
      const data = CatalogGetProductListModel.toViewData([
        { id: '100', sku: 'SKU-0001', name: 'Lamp' },
        { id: '103', sku: 'SKU-0004', name: 'Desk' },
      ]);

      expect(data).toEqual([
        { id: '100', sku: 'SKU-0001', name: 'Lamp' },
        { id: '103', sku: 'SKU-0004', name: 'Desk' },
      ]);
    });

    it('answers no snapshots for no records', () => {
      expect(CatalogGetProductListModel.toViewData([])).toEqual([]);
    });
  });
});
