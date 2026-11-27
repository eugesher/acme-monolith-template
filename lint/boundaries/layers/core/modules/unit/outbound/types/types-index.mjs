export const coreModulesUnitOutboundTypesIndex = {
  category: 'core:modules:unit:outbound:types:index',
  pattern: 'core/modules/src/*/outbound/types/index.ts',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
