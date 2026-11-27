export const coreModulesUnitOutboundTypesRecords = {
  category: 'core:modules:unit:outbound:types:records',
  pattern: 'core/modules/src/*/outbound/types/records/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
  ],
};
