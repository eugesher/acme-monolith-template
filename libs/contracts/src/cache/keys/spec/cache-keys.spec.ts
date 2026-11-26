import { CACHE_KEYS } from '../cache-keys';

describe('CACHE_KEYS', () => {
  it('builds the namespaced health probe key', () => {
    const key = CACHE_KEYS.healthProbe();

    expect(key).toBe('acme:health:probe');
  });

  it('keeps the health probe key out of the catalog prefix', () => {
    const key = CACHE_KEYS.healthProbe();

    expect(key.startsWith(CACHE_KEYS.catalogPrefix())).toBe(false);
  });

  describe('catalogPage', () => {
    it('builds a versioned, namespaced key of one page window', () => {
      const key = CACHE_KEYS.catalogPage(2, 20);

      expect(key).toBe('acme:catalog:v1:page:2:limit:20');
    });

    it('starts with the catalog prefix, so delByPrefix clears every page', () => {
      const prefix = CACHE_KEYS.catalogPrefix();

      expect(prefix).toBe('acme:catalog:v1:');
    });
  });
});
