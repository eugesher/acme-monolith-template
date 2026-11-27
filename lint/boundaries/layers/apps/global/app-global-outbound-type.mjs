export default {
  category: 'acme-app:global:outbound:types',
  pattern: 'apps/*/src/global/*/outbound/types/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
