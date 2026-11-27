export default {
  category: 'acme-app:common:modules:outbound:ports',
  pattern: 'apps/*/src/common/modules/*/outbound/ports/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
