export default {
  category: 'core:modules:unit:outbound',
  pattern: 'core/modules/src/*/outbound/*.ts',
  capture: ['unit'],
  allow: [
    '@acme-core/modules/<unit>/outbound/**',
    '@acme-core/contracts/<unit>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
