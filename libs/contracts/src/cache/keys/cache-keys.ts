const ROOT = 'acme';
const CATALOG_KEY_VERSION = 'v1';

export const CACHE_KEYS = {
  healthProbe: (): string => `${ROOT}:health:probe`,
  catalogPrefix: (): string => `${ROOT}:catalog:${CATALOG_KEY_VERSION}:`,
  catalogPage: (page: number, limit: number): string =>
    `${CACHE_KEYS.catalogPrefix()}page:${page}:limit:${limit}`,
};
