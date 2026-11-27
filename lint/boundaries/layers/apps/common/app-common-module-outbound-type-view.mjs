export default {
  category: 'acme-app:common:modules:outbound:types:views',
  pattern: 'apps/*/src/common/modules/*/outbound/types/views/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/common/modules/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
