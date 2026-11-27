export default {
  category: 'acme-app:common:modules:outbound:types:records',
  pattern: 'apps/*/src/common/modules/*/outbound/types/records/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
    '@acme-core/entities',
    '@acme-<app>/common/entities',
  ],
};
