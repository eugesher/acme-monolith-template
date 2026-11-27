export default {
  category: 'acme-core:modules:outbound:types:queries',
  pattern: 'core/modules/src/*/outbound/types/queries/**',
  capture: ['module', 'file'],
  allow: [
    '@acme-core/modules/<module>/outbound/**',
    '@acme-core/contracts/<module>',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
  ],
};
