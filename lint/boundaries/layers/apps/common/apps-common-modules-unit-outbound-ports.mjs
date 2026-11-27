export default {
  category: 'apps:common:modules:unit:outbound:ports',
  pattern: 'apps/*/src/common/modules/*/outbound/ports/**',
  capture: ['app', 'unit'],
  allow: [
    '@acme-<app>/common/modules/<unit>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
