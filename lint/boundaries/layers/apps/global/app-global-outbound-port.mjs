export default {
  category: 'acme-app:global:outbound:ports',
  pattern: 'apps/*/src/global/*/outbound/ports/**',
  capture: ['app', 'module', 'file'],
  allow: [
    '@acme-<app>/global/<module>/outbound/**',
    '@acme-libs/kernel',
    '@acme-libs/toolkit',
    '@acme-libs/domain',
  ],
};
