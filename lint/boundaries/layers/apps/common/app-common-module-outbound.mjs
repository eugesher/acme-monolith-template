export default {
  category: 'acme-app:common:modules:outbound',
  pattern: 'apps/*/src/common/modules/*/outbound/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
