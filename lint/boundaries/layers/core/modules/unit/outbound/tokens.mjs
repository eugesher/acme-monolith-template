export const coreModulesUnitOutboundTokens = {
  category: 'core:modules:unit:outbound:tokens',
  pattern: 'core/modules/src/*/outbound/tokens/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
