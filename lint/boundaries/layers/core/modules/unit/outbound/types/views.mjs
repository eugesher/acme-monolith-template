export const coreModulesUnitOutboundTypesViews = {
  category: 'core:modules:unit:outbound:types:views',
  pattern: 'core/modules/src/*/outbound/types/views/**',
  capture: ['unit'],
  allow: [
    '@acme-libs/domain',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-core/contracts/<unit>',

    '@acme-core/modules/<unit>/outbound/**',
  ],
};
