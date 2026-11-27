export const coreModulesUnitOutboundTypesIndex = {
  category: 'core:modules:unit:outbound:types:index',
  pattern: 'core/modules/src/*/outbound/types/index.ts',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
