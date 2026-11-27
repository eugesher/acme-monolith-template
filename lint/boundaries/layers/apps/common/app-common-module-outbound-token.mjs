export default {
  category: 'acme-app:common:modules:outbound:tokens',
  pattern: 'apps/*/src/common/modules/*/outbound/tokens/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
