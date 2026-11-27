export const coreModulesUnitOutboundTypes = {
  category: 'core:modules:unit:outbound:types',
  pattern: 'core/modules/src/*/outbound/types/*.ts',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
