export const coreModulesUnitOutboundTokens = {
  category: 'core:modules:unit:outbound:tokens',
  pattern: 'core/modules/src/*/outbound/tokens/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
