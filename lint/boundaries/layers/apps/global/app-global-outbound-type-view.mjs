export default {
  category: 'acme-app:global:outbound:types:views',
  pattern: 'apps/*/src/global/*/outbound/types/views/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
