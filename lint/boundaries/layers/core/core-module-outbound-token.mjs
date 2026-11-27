export default {
  category: 'acme-core:modules:outbound:tokens',
  pattern: 'core/modules/src/*/outbound/tokens/**',
  capture: ['module', 'file'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
