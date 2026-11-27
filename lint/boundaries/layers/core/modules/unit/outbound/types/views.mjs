export const coreModulesUnitOutboundTypesViews = {
  category: 'core:modules:unit:outbound:types:views',
  pattern: 'core/modules/src/*/outbound/types/views/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
