export const coreModulesUnitOutboundIndex = {
  category: 'core:modules:unit:outbound:index',
  pattern: 'core/modules/src/*/outbound/index.ts',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
