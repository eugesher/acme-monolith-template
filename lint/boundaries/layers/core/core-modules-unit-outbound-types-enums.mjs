export default {
  category: 'core:modules:unit:outbound:types:enums',
  pattern: 'core/modules/src/*/outbound/types/enums/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
