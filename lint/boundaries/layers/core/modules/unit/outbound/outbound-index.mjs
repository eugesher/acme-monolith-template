export const coreModulesUnitOutboundIndex = {
  category: 'core:modules:unit:outbound:index',
  pattern: 'core/modules/src/*/outbound/index.ts',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
