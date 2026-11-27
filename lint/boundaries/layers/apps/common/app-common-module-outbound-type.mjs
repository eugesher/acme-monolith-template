export default {
  category: 'acme-app:common:modules:outbound:types',
  pattern: 'apps/*/src/common/modules/*/outbound/types/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
