export default {
  category: 'acme-core:modules:outbound:types:views',
  pattern: 'core/modules/src/*/outbound/types/views/**',
  capture: ['module', 'file'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
