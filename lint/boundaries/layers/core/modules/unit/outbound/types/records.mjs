export const coreModulesUnitOutboundTypesRecords = {
  category: 'core:modules:unit:outbound:types:records',
  pattern: 'core/modules/src/*/outbound/types/records/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
