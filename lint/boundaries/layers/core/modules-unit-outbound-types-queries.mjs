export const coreModulesUnitOutboundTypesQueries = {
  category: 'core:modules:unit:outbound:types:queries',
  pattern: 'core/modules/src/*/outbound/types/queries/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
  ],
};
