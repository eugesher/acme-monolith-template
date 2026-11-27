export default {
  category: 'acme-core:modules:outbound:types:enums',
  pattern: 'core/modules/src/*/outbound/types/enums/**',
  capture: ['module', 'file'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
