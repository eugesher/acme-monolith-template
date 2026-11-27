export default {
  category: 'core:modules:unit:outbound:types:commands',
  pattern: 'core/modules/src/*/outbound/types/commands/**',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
