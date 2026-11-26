import { CatalogProductListModel } from '../catalog-product-list.model';

describe('CatalogProductListModel', () => {
  describe('toViewData', () => {
    it('answers the snapshot of every listed product', () => {
      const data = CatalogProductListModel.toViewData([
        { id: '100', sku: 'SKU-0001', name: 'Lamp' },
        { id: '103', sku: 'SKU-0004', name: 'Desk' },
      ]);

      expect(data).toEqual([
        { id: '100', sku: 'SKU-0001', name: 'Lamp' },
        { id: '103', sku: 'SKU-0004', name: 'Desk' },
      ]);
    });

    it('answers no snapshots for no records', () => {
      expect(CatalogProductListModel.toViewData([])).toEqual([]);
    });
  });
});
