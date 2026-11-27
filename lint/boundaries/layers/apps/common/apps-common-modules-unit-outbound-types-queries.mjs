export default {
  category: 'apps:common:modules:unit:outbound:types:queries',
  pattern: 'apps/*/src/common/modules/*/outbound/types/queries/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
