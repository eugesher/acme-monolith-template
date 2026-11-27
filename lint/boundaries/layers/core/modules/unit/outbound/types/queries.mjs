export const coreModulesUnitOutboundTypesQueries = {
  category: 'core:modules:unit:outbound:types:queries',
  pattern: 'core/modules/src/*/outbound/types/queries/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/entities',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
